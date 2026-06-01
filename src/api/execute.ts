import { parseCurlToFetch } from '../utils/curlToFetch';

export type EngineType = 'browser' | 'server';

export interface ResponseHeaderEntry {
  name: string;
  value: string;
}

export interface ResponseHeaderBlock {
  statusLine: string;
  headers: ResponseHeaderEntry[];
}

export interface ExecuteResult {
  ok: boolean;
  exitCode: number | null;
  stderr: string;
  statusCode: number | null;
  timeMs: number | null;
  sizeBytes: number | null;
  url: string | null;
  contentType: string | null;
  headers: ResponseHeaderBlock[];
  body: string;
  clientElapsedMs?: number;
  error?: string;
  hint?: string;
  /** 用哪种引擎执行的 */
  engine?: EngineType;
  /** 浏览器引擎下，本次翻译时丢弃 / 不支持的 flag */
  unsupported?: string[];
  /** 浏览器引擎抛 TypeError 时设置，UI 用来提示用户切换 server */
  corsLike?: boolean;
}

/** 统一入口：根据 engine 派发到对应实现 */
export async function executeCurl(
  command: string,
  engine: EngineType
): Promise<ExecuteResult> {
  if (engine === 'browser') return executeInBrowser(command);
  return executeViaServer(command);
}

/* ---------------------------------------------------------------------------
 * server engine：走 /api/execute，本机 Node spawn curl
 * ------------------------------------------------------------------------- */
async function executeViaServer(command: string): Promise<ExecuteResult> {
  try {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    const json = (await res.json()) as ExecuteResult;
    return { ...json, engine: 'server' };
  } catch (e: any) {
    return {
      ...emptyResult(),
      engine: 'server',
      error: e?.message || String(e),
      hint: '本地代理不可用，请先启动 server: npm run dev:server',
    };
  }
}

/* ---------------------------------------------------------------------------
 * browser engine：解析 curl → fetch
 * ------------------------------------------------------------------------- */
async function executeInBrowser(command: string): Promise<ExecuteResult> {
  let parsed;
  try {
    parsed = parseCurlToFetch(command);
  } catch (e: any) {
    return {
      ...emptyResult(),
      engine: 'browser',
      error: e?.message || String(e),
    };
  }

  const t0 = performance.now();
  try {
    const res = await fetch(parsed.url, {
      method: parsed.method,
      headers: parsed.headers,
      body: parsed.body,
      // mode: cors 默认。redirect: follow 默认。
    });
    const headerEntries: ResponseHeaderEntry[] = [];
    res.headers.forEach((v, k) => headerEntries.push({ name: k, value: v }));

    const text = await res.text();
    const elapsed = performance.now() - t0;
    const size = new Blob([text]).size;

    return {
      ok: true,
      engine: 'browser',
      exitCode: 0,
      stderr: '',
      statusCode: res.status,
      timeMs: Math.round(elapsed),
      sizeBytes: size,
      url: res.url || parsed.url,
      contentType: res.headers.get('content-type'),
      headers: [
        {
          statusLine: `HTTP/1.1 ${res.status} ${res.statusText || ''}`.trim(),
          headers: headerEntries,
        },
      ],
      body: text,
      clientElapsedMs: Math.round(elapsed),
      unsupported: parsed.unsupported.length ? parsed.unsupported : undefined,
    };
  } catch (e: any) {
    // fetch 抛 TypeError 时几乎都是「Failed to fetch」——CORS / 网络 / TLS 等
    // 浏览器有意不区分这些情况以防 side-channel 探测
    const isTypeError = e instanceof TypeError;
    return {
      ...emptyResult(),
      engine: 'browser',
      error: e?.message || String(e),
      unsupported: parsed.unsupported.length ? parsed.unsupported : undefined,
      corsLike: isTypeError,
    };
  }
}

function emptyResult(): ExecuteResult {
  return {
    ok: false,
    exitCode: null,
    stderr: '',
    statusCode: null,
    timeMs: null,
    sizeBytes: null,
    url: null,
    contentType: null,
    headers: [],
    body: '',
  };
}
