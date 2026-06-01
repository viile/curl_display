import express from 'express';
import cors from 'cors';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

/**
 * 将一段 curl 命令字符串解析为 argv（不依赖系统 shell，避免注入与跨平台问题）。
 * 支持单引号 / 双引号 / 反斜杠续行 / 反斜杠转义。
 */
function tokenizeCurl(input) {
  const text = input.replace(/\\\r?\n/g, ' ').trim();
  const tokens = [];
  let buf = '';
  let i = 0;
  let quote = null; // null | '"' | "'"

  const pushToken = () => {
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
      quote = ch;
      i++;
      continue;
    }

    if (ch === '\\' && i + 1 < text.length) {
      buf += text[i + 1];
      i += 2;
      continue;
    }

    if (/\s/.test(ch)) {
      pushToken();
      i++;
      continue;
    }

    buf += ch;
    i++;
  }
  pushToken();

  if (quote) {
    throw new Error(`未闭合的 ${quote} 引号`);
  }
  if (tokens.length === 0) {
    throw new Error('命令为空');
  }
  if (tokens[0] !== 'curl') {
    throw new Error('命令必须以 curl 开头');
  }
  return tokens.slice(1);
}

/**
 * 执行 curl。为了拿到状态码 / 响应头 / 响应体 / 耗时，
 * 我们注入 -s -i (返回响应头+体) 与 -w 写出时序统计。
 */
function runCurl(userArgs) {
  return new Promise(async (resolve, reject) => {
    const tmpHeaderFile = path.join(os.tmpdir(), `curl-h-${randomUUID()}.txt`);

    // 去掉用户里可能写的 -i / --include，避免和我们注入的重复
    const cleaned = userArgs.filter(
      (a) => a !== '-i' && a !== '--include' && a !== '-I' && a !== '--head'
    );

    // -s 静默; -D 写响应头到文件; -w 输出统计 JSON 行
    const writeOut =
      '\n__CURL_META__' +
      JSON.stringify({
        http_code: '%{http_code}',
        time_total: '%{time_total}',
        size_download: '%{size_download}',
        url_effective: '%{url_effective}',
        content_type: '%{content_type}',
      });

    const finalArgs = [
      '-s',
      '-S',
      '-D',
      tmpHeaderFile,
      '-w',
      writeOut,
      ...cleaned,
    ];

    const child = spawn('curl', finalArgs, {
      env: process.env,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString('utf-8')));
    child.stderr.on('data', (d) => (stderr += d.toString('utf-8')));

    child.on('error', (err) => {
      reject(err);
    });

    child.on('close', async (code) => {
      try {
        let meta = {};
        let body = stdout;
        const metaIdx = stdout.lastIndexOf('\n__CURL_META__');
        if (metaIdx !== -1) {
          body = stdout.slice(0, metaIdx);
          const metaJson = stdout.slice(metaIdx + '\n__CURL_META__'.length);
          try {
            meta = JSON.parse(metaJson);
          } catch {
            meta = {};
          }
        }

        let headersText = '';
        try {
          headersText = await fs.readFile(tmpHeaderFile, 'utf-8');
        } catch {
          headersText = '';
        } finally {
          fs.unlink(tmpHeaderFile).catch(() => {});
        }

        const headerBlocks = parseHeaders(headersText);

        resolve({
          ok: code === 0,
          exitCode: code,
          stderr: stderr.trim(),
          statusCode: meta.http_code ? Number(meta.http_code) : null,
          timeMs: meta.time_total ? Math.round(Number(meta.time_total) * 1000) : null,
          sizeBytes: meta.size_download ? Number(meta.size_download) : null,
          url: meta.url_effective || null,
          contentType: meta.content_type || null,
          headers: headerBlocks,
          body,
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * 解析 curl -D 写出的响应头文本，可能包含多段（重定向）。
 * 返回每一段 { statusLine, headers: [{name,value}] }
 */
function parseHeaders(text) {
  if (!text) return [];
  const segments = text.split(/\r?\n\r?\n/).filter((s) => s.trim().length > 0);
  return segments.map((seg) => {
    const lines = seg.split(/\r?\n/);
    const statusLine = lines.shift() || '';
    const headers = lines
      .map((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return null;
        return {
          name: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
        };
      })
      .filter(Boolean);
    return { statusLine, headers };
  });
}

app.post('/api/execute', async (req, res) => {
  const { command } = req.body || {};
  if (typeof command !== 'string' || !command.trim()) {
    return res.status(400).json({ ok: false, error: '命令不能为空' });
  }

  let argv;
  try {
    argv = tokenizeCurl(command);
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message });
  }

  const startedAt = Date.now();
  try {
    const result = await runCurl(argv);
    res.json({
      ...result,
      clientElapsedMs: Date.now() - startedAt,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e?.message || String(e),
      hint: '请确认本机已安装 curl 命令',
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`[curl-display] server listening on http://localhost:${PORT}`);
});
