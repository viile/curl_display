/**
 * 把 curl 命令拆解为「可读的解码视图」。
 *
 * 主要用途：把 --data / --data-binary / --data-raw / --data-urlencode 中
 * 形如 `a=1&b=%E5%BC%A0%E8%83%A1` 的表单串解码成 key→value 表格，
 * 同时也展示 URL query、headers、cookie 等结构化信息。
 *
 * 与 curlToFetch.ts 的区别：
 *   - 这里完全不构造请求，只做「拆解 + URL 解码」
 *   - 不会标记 unsupported，也不关心浏览器能不能跑
 */
import { tokenizeCurl } from './curl';

export interface DecodedKV {
  /** 解码后的 key（去掉 + → 空格、%XX → 字符） */
  key: string;
  /** 解码前的原始 value（保留 %XX） */
  rawValue: string;
  /** 解码后的 value */
  decodedValue: string;
  /** decodedValue 与 rawValue 是否真的发生了变化 */
  changed: boolean;
}

export interface DecodedHeader {
  name: string;
  value: string;
}

export interface DecodedDataPart {
  /** 使用的 flag，例如 -d / --data-binary */
  flag: string;
  /** 原始字符串（去掉 shell 引号后） */
  raw: string;
  /**
   * 解析为表单的 KV 列表；
   * 如果根本不是 form-urlencoded（例如 JSON），则为 null，
   * 调用方应回退展示原文。
   */
  pairs: DecodedKV[] | null;
  /** 数据形态推测：form / json / text */
  kind: 'form' | 'json' | 'text';
  /** 当 kind === 'json' 时，pretty 之后的 JSON 文本，便于直接显示 */
  prettyJson?: string;
}

export interface DecodedUrl {
  /** 原始（含 query）URL */
  full: string;
  /** 去掉 query 的 URL */
  base: string;
  /** 解码后的 query 参数 */
  query: DecodedKV[];
}

export interface DecodedCurl {
  method: string;
  url: DecodedUrl | null;
  headers: DecodedHeader[];
  cookies: DecodedKV[];
  /** -d / --data / --data-raw / --data-binary / --data-urlencode */
  dataParts: DecodedDataPart[];
  /** -F / --form */
  forms: DecodedKV[];
  /** 解析过程中遇到的非致命问题，UI 可以选择展示 */
  warnings: string[];
}

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

/** 安全 decodeURIComponent：失败则原样返回，避免「畸形序列」抛错 */
export function safeDecode(s: string): string {
  if (!s) return s;
  try {
    return decodeURIComponent(s);
  } catch {
    // 退而求其次：尝试把每个 %XX 单独解，不行就保留
    return s.replace(/%[0-9A-Fa-f]{2}/g, (m) => {
      try {
        return decodeURIComponent(m);
      } catch {
        return m;
      }
    });
  }
}

/** 解析 form-urlencoded：a=1&b=%E5%BC%A0 → [{key:'a',raw:'1',decoded:'1'},...] */
export function parseFormUrlencoded(input: string): DecodedKV[] {
  if (!input) return [];
  const out: DecodedKV[] = [];
  // 注意：不要 split('&amp;')，curl 的 data 是裸的 form-encoded
  for (const part of input.split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    const rawValue = eq === -1 ? '' : part.slice(eq + 1);
    // form-urlencoded 标准里 + 表示空格
    const decodedKey = safeDecode(rawKey.replace(/\+/g, ' '));
    const decodedValue = safeDecode(rawValue.replace(/\+/g, ' '));
    out.push({
      key: decodedKey,
      rawValue,
      decodedValue,
      changed: rawValue !== decodedValue,
    });
  }
  return out;
}

/** 长得像 form-urlencoded 吗？(至少一个 `=`，整体仅 ASCII 可打印 + 不像 JSON) */
function looksLikeForm(s: string): boolean {
  const trimmed = s.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return false;
  if (!trimmed.includes('=')) return false;
  // 允许换行（有些复制粘贴会带），但不允许出现裸空格之外的"明显 JSON 字符"
  return true;
}

function tryParseJson(s: string): { ok: boolean; pretty?: string } {
  const trimmed = s.trim();
  if (!trimmed) return { ok: false };
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if (!((first === '{' && last === '}') || (first === '[' && last === ']'))) {
    return { ok: false };
  }
  try {
    const obj = JSON.parse(trimmed);
    return { ok: true, pretty: JSON.stringify(obj, null, 2) };
  } catch {
    return { ok: false };
  }
}

/** 把 --data-urlencode 的一段 (`name=value` 或纯 value) 还原成等价的 form 段 */
function dataUrlencodeToFormPart(part: string): string {
  const eq = part.indexOf('=');
  if (eq === -1) return encodeURIComponent(part);
  return part.slice(0, eq) + '=' + encodeURIComponent(part.slice(eq + 1));
}

function splitUrl(url: string): { base: string; query: string } {
  const qIdx = url.indexOf('?');
  if (qIdx === -1) return { base: url, query: '' };
  // 去掉 hash（curl 实际不会发送 hash，纯展示也忽略）
  let query = url.slice(qIdx + 1);
  const hIdx = query.indexOf('#');
  if (hIdx !== -1) query = query.slice(0, hIdx);
  return { base: url.slice(0, qIdx), query };
}

/** 解析 Cookie header / -b 'a=1; b=2' */
export function parseCookieString(input: string): DecodedKV[] {
  if (!input) return [];
  const out: DecodedKV[] = [];
  for (const seg of input.split(/;\s*/)) {
    if (!seg) continue;
    const eq = seg.indexOf('=');
    const rawKey = eq === -1 ? seg : seg.slice(0, eq);
    const rawValue = eq === -1 ? '' : seg.slice(eq + 1);
    const decodedKey = safeDecode(rawKey.trim());
    const decodedValue = safeDecode(rawValue.trim());
    out.push({
      key: decodedKey,
      rawValue: rawValue.trim(),
      decodedValue,
      changed: rawValue.trim() !== decodedValue,
    });
  }
  return out;
}

/**
 * 主入口：解码 curl。
 * 解析失败时抛错，由调用方捕获后展示给用户。
 */
export function decodeCurl(input: string): DecodedCurl {
  const tokens = tokenizeCurl(input);
  if (tokens[0] !== 'curl') throw new Error("命令必须以 'curl' 开头");
  const args = tokens.slice(1);

  let url = '';
  let method = '';
  const headers: DecodedHeader[] = [];
  const cookies: DecodedKV[] = [];
  const dataParts: DecodedDataPart[] = [];
  const forms: DecodedKV[] = [];
  const warnings: string[] = [];

  let i = 0;
  while (i < args.length) {
    const a = args[i];

    if (!a.startsWith('-')) {
      if (!url) url = a;
      i += 1;
      continue;
    }

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

    if (!wantsValue) continue;

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
        const colon = val!.indexOf(':');
        if (colon === -1) {
          warnings.push(`忽略无效 header: ${val}`);
          break;
        }
        const name = val!.slice(0, colon).trim();
        const value = val!.slice(colon + 1).trim();
        if (!name) {
          warnings.push(`忽略无效 header: ${val}`);
          break;
        }
        headers.push({ name, value });
        if (name.toLowerCase() === 'cookie') {
          for (const c of parseCookieString(value)) cookies.push(c);
        }
        break;
      }
      case '-b':
      case '--cookie':
        for (const c of parseCookieString(val!)) cookies.push(c);
        break;
      case '-d':
      case '--data':
      case '--data-raw':
      case '--data-ascii':
      case '--data-binary': {
        const raw = val!;
        if (looksLikeForm(raw)) {
          dataParts.push({
            flag,
            raw,
            pairs: parseFormUrlencoded(raw),
            kind: 'form',
          });
        } else {
          const j = tryParseJson(raw);
          if (j.ok) {
            dataParts.push({
              flag,
              raw,
              pairs: null,
              kind: 'json',
              prettyJson: j.pretty,
            });
          } else {
            dataParts.push({ flag, raw, pairs: null, kind: 'text' });
          }
        }
        break;
      }
      case '--data-urlencode': {
        // curl 会再做一层 encode，等价的 form 段才是真正会发到服务器的内容
        const formPart = dataUrlencodeToFormPart(val!);
        dataParts.push({
          flag,
          raw: val!,
          pairs: parseFormUrlencoded(formPart),
          kind: 'form',
        });
        break;
      }
      case '-F':
      case '--form': {
        const eq = val!.indexOf('=');
        if (eq === -1) {
          warnings.push(`忽略无效 form: ${val}`);
          break;
        }
        const k = val!.slice(0, eq);
        const v = val!.slice(eq + 1);
        forms.push({
          key: k,
          rawValue: v,
          decodedValue: v,
          changed: false,
        });
        break;
      }
      default:
        break;
    }
  }

  if (!method) {
    if (dataParts.length || forms.length) method = 'POST';
    else method = 'GET';
  }

  let urlInfo: DecodedUrl | null = null;
  if (url) {
    const { base, query } = splitUrl(url);
    urlInfo = {
      full: url,
      base,
      query: parseFormUrlencoded(query),
    };
  }

  return {
    method,
    url: urlInfo,
    headers,
    cookies,
    dataParts,
    forms,
    warnings,
  };
}

/** 整个 DecodedCurl 是否啥也没解出来 */
export function isDecodedEmpty(d: DecodedCurl): boolean {
  return (
    (!d.url || d.url.query.length === 0) &&
    d.headers.length === 0 &&
    d.cookies.length === 0 &&
    d.dataParts.length === 0 &&
    d.forms.length === 0
  );
}
