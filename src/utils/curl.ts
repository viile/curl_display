/**
 * 将一段 curl 命令字符串拆分为 argv 数组。
 * 支持单/双引号、反斜杠续行、反斜杠转义。
 * 与后端 tokenizeCurl 保持一致的语义。
 */
export function tokenizeCurl(input: string): string[] {
  const text = input.replace(/\\\r?\n/g, ' ').trim();
  const tokens: string[] = [];
  let buf = '';
  let i = 0;
  let quote: '"' | "'" | null = null;

  const flush = () => {
    if (buf.length > 0) {
      tokens.push(buf);
      buf = '';
    }
  };

  while (i < text.length) {
    const ch = text[i];

    if (quote) {
      if (ch === '\\' && quote === '"' && i + 1 < text.length) {
        buf += text[i + 1];
        i += 2;
        continue;
      }
      if (ch === quote) {
        quote = null;
        i++;
        continue;
      }
      buf += ch;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'";
      i++;
      continue;
    }

    if (ch === '\\' && i + 1 < text.length) {
      buf += text[i + 1];
      i += 2;
      continue;
    }

    if (/\s/.test(ch)) {
      flush();
      i++;
      continue;
    }

    buf += ch;
    i++;
  }
  flush();

  if (quote) throw new Error(`未闭合的 ${quote} 引号`);
  if (tokens.length === 0) throw new Error('命令为空');
  if (tokens[0] !== 'curl') throw new Error("命令必须以 'curl' 开头");

  return tokens;
}

/** 安全的 shell 单引号包裹 */
function shellQuote(value: string): string {
  if (value === '') return "''";
  // 不含特殊字符则不加引号
  if (/^[A-Za-z0-9_./:=@%+,\-]+$/.test(value)) return value;
  // 单引号包裹，内部的单引号用 '\'' 拼接
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** 这些 flag 后面跟一个值 */
const FLAGS_WITH_VALUE = new Set([
  '-A',
  '--user-agent',
  '-b',
  '--cookie',
  '-c',
  '--cookie-jar',
  '-d',
  '--data',
  '--data-raw',
  '--data-binary',
  '--data-urlencode',
  '-D',
  '--dump-header',
  '-e',
  '--referer',
  '-F',
  '--form',
  '-H',
  '--header',
  '-K',
  '--config',
  '-o',
  '--output',
  '-T',
  '--upload-file',
  '-u',
  '--user',
  '-w',
  '--write-out',
  '-X',
  '--request',
  '-x',
  '--proxy',
  '--url',
  '--cacert',
  '--cert',
  '--key',
  '--connect-timeout',
  '--max-time',
  '--retry',
  '--resolve',
]);

/**
 * 格式化 curl 命令：每个 flag 一行，body / header 分类排序。
 * 不改变原始语义。
 */
export function formatCurl(input: string): string {
  const tokens = tokenizeCurl(input);
  // 第一段是 'curl'
  const args = tokens.slice(1);

  const urls: string[] = [];
  const methods: string[] = [];
  const headers: string[] = [];
  const dataParts: string[] = []; // -d / --data*
  const forms: string[] = []; // -F
  const flagsBool: string[] = []; // 不带参数的 flag
  const otherKV: Array<{ flag: string; value: string }> = [];

  let i = 0;
  while (i < args.length) {
    const a = args[i];

    if (a.startsWith('-')) {
      // 处理 --header=xxx / -Hxxx 这种粘连写法
      let flag = a;
      let inlineValue: string | null = null;
      const eqIdx = a.indexOf('=');
      if (a.startsWith('--') && eqIdx !== -1) {
        flag = a.slice(0, eqIdx);
        inlineValue = a.slice(eqIdx + 1);
      } else if (
        a.length > 2 &&
        !a.startsWith('--') &&
        FLAGS_WITH_VALUE.has(a.slice(0, 2))
      ) {
        flag = a.slice(0, 2);
        inlineValue = a.slice(2);
      }

      const takesValue = FLAGS_WITH_VALUE.has(flag);
      let value: string | null = inlineValue;
      if (takesValue && value === null) {
        value = args[i + 1] ?? '';
        i += 2;
      } else {
        i += 1;
      }

      if (takesValue) {
        switch (flag) {
          case '-H':
          case '--header':
            headers.push(value!);
            break;
          case '-X':
          case '--request':
            methods.push(value!);
            break;
          case '-d':
          case '--data':
          case '--data-raw':
          case '--data-binary':
          case '--data-urlencode':
            dataParts.push(`${flag} ${shellQuote(value!)}`);
            break;
          case '-F':
          case '--form':
            forms.push(value!);
            break;
          case '--url':
            urls.push(value!);
            break;
          default:
            otherKV.push({ flag, value: value! });
        }
      } else {
        flagsBool.push(flag);
      }
      continue;
    }

    // 非 - 开头：视为 URL（curl 允许任意位置的 URL）
    urls.push(a);
    i += 1;
  }

  // 排序：稳定的视觉顺序
  headers.sort((a, b) => a.localeCompare(b));

  const lines: string[] = [];
  lines.push('curl ' + urls.map(shellQuote).join(' '));

  for (const m of methods) {
    lines.push(`  -X ${shellQuote(m)}`);
  }
  for (const h of headers) {
    lines.push(`  -H ${shellQuote(h)}`);
  }
  for (const f of forms) {
    lines.push(`  -F ${shellQuote(f)}`);
  }
  for (const d of dataParts) {
    lines.push(`  ${d}`);
  }
  for (const kv of otherKV) {
    lines.push(`  ${kv.flag} ${shellQuote(kv.value)}`);
  }
  for (const b of flagsBool) {
    lines.push(`  ${b}`);
  }

  return lines.join(' \\\n');
}

/** 压缩为单行（去掉续行符 + 折叠空白） */
export function minifyCurl(input: string): string {
  return input
    .replace(/\\\r?\n/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export interface CurlSummary {
  method: string;
  url: string;
}

/**
 * 从 curl 命令中提取方法和 URL，用于历史列表预览。
 * 容错：解析失败也返回空字符串而非抛错。
 */
export function extractCurlSummary(input: string): CurlSummary {
  let tokens: string[];
  try {
    tokens = tokenizeCurl(input);
  } catch {
    return { method: '', url: '' };
  }
  let method = '';
  let url = '';
  let i = 1; // 跳过 'curl'
  while (i < tokens.length) {
    const a = tokens[i];
    if (a === '-X' || a === '--request') {
      method = (tokens[i + 1] || '').toUpperCase();
      i += 2;
      continue;
    }
    if (a.startsWith('--request=')) {
      method = a.slice('--request='.length).toUpperCase();
      i += 1;
      continue;
    }
    if (a === '--url') {
      url = tokens[i + 1] || '';
      i += 2;
      continue;
    }
    if (a.startsWith('--url=')) {
      url = a.slice('--url='.length);
      i += 1;
      continue;
    }
    // 跳过其它带值 flag
    if (a.startsWith('-')) {
      const isLong = a.startsWith('--');
      const isInline = a.includes('=') && isLong;
      if (isInline) {
        i += 1;
        continue;
      }
      // 简单近似：所有非布尔短/长 flag 后跟一个值
      const flagsWithValue = new Set([
        '-H', '--header', '-d', '--data', '--data-raw', '--data-binary',
        '--data-urlencode', '-F', '--form', '-A', '--user-agent', '-b',
        '--cookie', '-c', '--cookie-jar', '-e', '--referer', '-o', '--output',
        '-u', '--user', '-T', '--upload-file', '-w', '--write-out', '-x',
        '--proxy', '-D', '--dump-header', '-K', '--config', '--cacert',
        '--cert', '--key', '--connect-timeout', '--max-time', '--retry',
        '--resolve',
      ]);
      if (flagsWithValue.has(a)) {
        i += 2;
      } else if (!isLong && a.length > 2 && flagsWithValue.has(a.slice(0, 2))) {
        i += 1; // 粘连写法 -Hxxx
      } else {
        i += 1;
      }
      continue;
    }
    if (!url) {
      url = a;
    }
    i += 1;
  }
  if (!method) method = 'GET';
  return { method, url };
}
