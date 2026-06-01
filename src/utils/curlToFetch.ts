/**
 * 把 curl 命令翻译为浏览器 fetch 请求。
 *
 * 浏览器沙箱限制：
 *   - 不支持 -A/-e/-b 等修改受限 header（User-Agent/Referer/Cookie/Host 等由浏览器管控）
 *   - 不支持 --proxy / --resolve / --cacert / --cert / --key（TLS / 网络栈不可改）
 *   - 不支持 -T file:path 读取本地任意文件
 *   - 中间重定向无法逐步观察（只能拿最终响应）
 *
 * 不支持的 flag 会被收集到 unsupported[]，由 UI 展示给用户。
 */
import { tokenizeCurl } from './curl';

export interface ParsedCurl {
  url: string;
  method: string;
  headers: Array<[string, string]>;
  body?: BodyInit | null;
  /** 浏览器会忽略 / 拒绝的 flag，给 UI 提示 */
  unsupported: string[];
}

/** 浏览器禁止 JS 修改的 header（按 Fetch 规范） */
const FORBIDDEN_HEADERS = new Set([
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
  // 'User-Agent' 在大多数现代浏览器允许，但部分仍拒绝
]);

const FLAG_VALUE = new Set([
  '-A', '--user-agent',
  '-b', '--cookie',
  '-c', '--cookie-jar',
  '-d', '--data', '--data-raw', '--data-ascii',
  '--data-binary', '--data-urlencode',
  '-D', '--dump-header',
  '-e', '--referer',
  '-F', '--form',
  '-H', '--header',
  '-K', '--config',
  '-o', '--output',
  '-T', '--upload-file',
  '-u', '--user',
  '-w', '--write-out',
  '-X', '--request',
  '-x', '--proxy',
  '--url',
  '--cacert', '--cert', '--key',
  '--connect-timeout', '--max-time', '--retry',
  '--resolve',
]);

/** 不带值的开关 flag（仅列出我们关心的） */
const FLAG_BOOL = new Set([
  '-L', '--location',
  '-k', '--insecure',
  '-s', '--silent',
  '-S', '--show-error',
  '-v', '--verbose',
  '-i', '--include',
  '-I', '--head',
  '--compressed',
  '-G', '--get',
  '-#', '--progress-bar',
  '-O', '--remote-name',
  '-J', '--remote-header-name',
]);

/** 浏览器忽略但语义无害的 flag，不计入 unsupported 警告 */
const SILENTLY_IGNORED = new Set([
  '-L', '--location',
  '-s', '--silent',
  '-S', '--show-error',
  '-v', '--verbose',
  '-i', '--include',
  '--compressed',
  '-#', '--progress-bar',
  '-O', '--remote-name',
  '-J', '--remote-header-name',
]);

function btoaUnicode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

export function parseCurlToFetch(input: string): ParsedCurl {
  const tokens = tokenizeCurl(input);
  if (tokens[0] !== 'curl') throw new Error("命令必须以 'curl' 开头");
  const args = tokens.slice(1);

  let url = '';
  let method = '';
  let useGet = false;
  let isHead = false;
  const headerMap = new Map<string, string>();
  const dataParts: string[] = []; // 普通 -d
  const dataBinary: string[] = []; // --data-binary
  const dataUrlencodeParts: string[] = []; // --data-urlencode
  const forms: Array<[string, string]> = []; // -F name=value
  const unsupported: string[] = [];
  let basicAuth: string | null = null;

  let i = 0;
  while (i < args.length) {
    const a = args[i];

    if (!a.startsWith('-')) {
      // 视为 URL
      if (!url) url = a;
      i += 1;
      continue;
    }

    // 处理 --flag=value / 短 flag 粘连写法
    let flag = a;
    let inlineVal: string | null = null;
    const eqIdx = a.indexOf('=');
    if (a.startsWith('--') && eqIdx !== -1) {
      flag = a.slice(0, eqIdx);
      inlineVal = a.slice(eqIdx + 1);
    } else if (
      !a.startsWith('--') &&
      a.length > 2 &&
      FLAG_VALUE.has(a.slice(0, 2))
    ) {
      flag = a.slice(0, 2);
      inlineVal = a.slice(2);
    }

    const wantsValue = FLAG_VALUE.has(flag);
    let val: string | null = inlineVal;
    if (wantsValue && val === null) {
      val = args[i + 1] ?? '';
      i += 2;
    } else {
      i += 1;
    }

    if (wantsValue) {
      switch (flag) {
        case '-X':
        case '--request':
          method = (val || '').toUpperCase();
          break;
        case '--url':
          if (!url) url = val!;
          break;
        case '-H':
        case '--header': {
          const colonIdx = val!.indexOf(':');
          if (colonIdx !== -1) {
            const name = val!.slice(0, colonIdx).trim();
            const value = val!.slice(colonIdx + 1).trim();
            if (!name) break;
            if (FORBIDDEN_HEADERS.has(name.toLowerCase())) {
              unsupported.push(`-H ${name} (浏览器禁止修改)`);
            } else {
              headerMap.set(name, value);
            }
          }
          break;
        }
        case '-d':
        case '--data':
        case '--data-raw':
        case '--data-ascii':
          dataParts.push(val!);
          break;
        case '--data-binary':
          dataBinary.push(val!);
          break;
        case '--data-urlencode':
          dataUrlencodeParts.push(val!);
          break;
        case '-F':
        case '--form': {
          const eq = val!.indexOf('=');
          if (eq !== -1) {
            forms.push([val!.slice(0, eq), val!.slice(eq + 1)]);
          }
          break;
        }
        case '-u':
        case '--user':
          basicAuth = val!;
          break;
        case '-A':
        case '--user-agent':
          unsupported.push('-A/--user-agent (浏览器禁止修改 User-Agent)');
          break;
        case '-e':
        case '--referer':
          unsupported.push('-e/--referer (浏览器自动管理 Referer)');
          break;
        case '-b':
        case '--cookie':
          unsupported.push('-b/--cookie (浏览器自动管理 Cookie)');
          break;
        case '-c':
        case '--cookie-jar':
        case '-D':
        case '--dump-header':
        case '-o':
        case '--output':
        case '-T':
        case '--upload-file':
        case '-K':
        case '--config':
        case '-w':
        case '--write-out':
          unsupported.push(`${flag} (浏览器环境不适用)`);
          break;
        case '-x':
        case '--proxy':
        case '--cacert':
        case '--cert':
        case '--key':
        case '--resolve':
        case '--connect-timeout':
        case '--max-time':
        case '--retry':
          unsupported.push(`${flag} (浏览器无法配置)`);
          break;
        default:
          unsupported.push(`${flag} (未实现)`);
      }
    } else if (FLAG_BOOL.has(flag)) {
      if (flag === '-G' || flag === '--get') useGet = true;
      else if (flag === '-I' || flag === '--head') isHead = true;
      else if (!SILENTLY_IGNORED.has(flag)) {
        unsupported.push(`${flag} (浏览器环境不适用)`);
      }
      if (flag === '-k' || flag === '--insecure') {
        unsupported.push('-k/--insecure (浏览器 TLS 不可绕过)');
      }
    } else {
      unsupported.push(`${flag} (未识别)`);
    }
  }

  if (!url) throw new Error('缺少 URL');

  // Basic Auth
  if (basicAuth !== null) {
    headerMap.set('Authorization', 'Basic ' + btoaUnicode(basicAuth));
  }

  // -G：把 data 拼到 query string
  if (useGet && (dataParts.length || dataUrlencodeParts.length || dataBinary.length)) {
    const sep = url.includes('?') ? '&' : '?';
    const qs = [
      ...dataParts,
      ...dataBinary,
      ...dataUrlencodeParts.map((p) => {
        // name=value → 对 value urlencode；只有 value 时整体 urlencode
        const eq = p.indexOf('=');
        if (eq === -1) return encodeURIComponent(p);
        return p.slice(0, eq) + '=' + encodeURIComponent(p.slice(eq + 1));
      }),
    ].join('&');
    url = url + sep + qs;
  }

  // 方法推断
  if (!method) {
    if (isHead) method = 'HEAD';
    else if (forms.length || dataParts.length || dataBinary.length || dataUrlencodeParts.length) {
      method = useGet ? 'GET' : 'POST';
    } else method = 'GET';
  }

  // 构造 body
  let body: BodyInit | null | undefined;
  const noBodyMethod = method === 'GET' || method === 'HEAD';

  if (!noBodyMethod) {
    if (forms.length) {
      const fd = new FormData();
      for (const [k, v] of forms) {
        // -F 'file=@path' 这种引用本地文件的，浏览器无法读取，标记不支持
        if (v.startsWith('@')) {
          unsupported.push(`-F ${k}=@... (浏览器无法读取本地文件)`);
          continue;
        }
        fd.append(k, v);
      }
      body = fd;
      // FormData 时让浏览器自动设置 multipart boundary，移除用户手动设置的 content-type
      for (const key of Array.from(headerMap.keys())) {
        if (key.toLowerCase() === 'content-type') headerMap.delete(key);
      }
    } else if (dataBinary.length) {
      body = dataBinary.join('');
    } else if (dataUrlencodeParts.length || dataParts.length) {
      const enc = [
        ...dataParts,
        ...dataUrlencodeParts.map((p) => {
          const eq = p.indexOf('=');
          if (eq === -1) return encodeURIComponent(p);
          return p.slice(0, eq) + '=' + encodeURIComponent(p.slice(eq + 1));
        }),
      ].join('&');
      body = enc;
      // 默认 Content-Type
      const hasCt = Array.from(headerMap.keys()).some(
        (k) => k.toLowerCase() === 'content-type'
      );
      if (!hasCt) {
        headerMap.set('Content-Type', 'application/x-www-form-urlencoded');
      }
    }
  }

  return {
    url,
    method,
    headers: Array.from(headerMap.entries()),
    body,
    unsupported,
  };
}
