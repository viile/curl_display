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
}

export async function executeCurl(command: string): Promise<ExecuteResult> {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ command }),
  });
  const json = (await res.json()) as ExecuteResult;
  return json;
}
