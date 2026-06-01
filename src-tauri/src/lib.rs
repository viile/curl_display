//! Tauri 命令：在本机以子进程方式调用 `curl`，返回与前端 ExecuteResult 同构的 JSON。
//!
//! 注入的 flag：
//!   -s -S            静默 + 出错时仍打印 stderr
//!   -D <tmp>         把响应头写到临时文件（含重定向链）
//!   -w <meta>        在 stdout 末尾追加一行机读 meta（状态码、耗时、大小、最终 URL、Content-Type）
//!
//! 然后用 `__CURL_META__` 切分 stdout 拿到 body 与 meta。

use serde::{Deserialize, Serialize};
use std::time::Instant;
use tokio::io::AsyncReadExt;
use tokio::process::Command;

const META_MARKER: &str = "\n__CURL_META__";

#[derive(Serialize, Clone)]
pub struct HeaderEntry {
    pub name: String,
    pub value: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HeaderBlock {
    pub status_line: String,
    pub headers: Vec<HeaderEntry>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExecuteResult {
    pub ok: bool,
    pub exit_code: Option<i32>,
    pub stderr: String,
    pub status_code: Option<u32>,
    pub time_ms: Option<u32>,
    pub size_bytes: Option<u64>,
    pub url: Option<String>,
    pub content_type: Option<String>,
    pub headers: Vec<HeaderBlock>,
    pub body: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub client_elapsed_ms: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hint: Option<String>,
    pub engine: &'static str,
}

#[derive(Deserialize, Default)]
struct CurlMeta {
    http_code: Option<String>,
    time_total: Option<String>,
    size_download: Option<String>,
    url_effective: Option<String>,
    content_type: Option<String>,
}

fn err_result(msg: impl Into<String>, hint: Option<&str>) -> ExecuteResult {
    ExecuteResult {
        ok: false,
        exit_code: None,
        stderr: String::new(),
        status_code: None,
        time_ms: None,
        size_bytes: None,
        url: None,
        content_type: None,
        headers: vec![],
        body: String::new(),
        client_elapsed_ms: None,
        error: Some(msg.into()),
        hint: hint.map(String::from),
        engine: "desktop",
    }
}

/// 与 server/index.js::tokenizeCurl 行为一致：支持单/双引号、反斜杠转义、反斜杠续行。
fn tokenize_curl(input: &str) -> Result<Vec<String>, String> {
    let text: String = input
        .replace("\\\r\n", " ")
        .replace("\\\n", " ")
        .trim()
        .to_string();
    let bytes: Vec<char> = text.chars().collect();
    let mut tokens: Vec<String> = vec![];
    let mut buf = String::new();
    let mut quote: Option<char> = None;
    let mut i = 0usize;

    while i < bytes.len() {
        let ch = bytes[i];
        match quote {
            Some(q) => {
                if ch == '\\' && q == '"' && i + 1 < bytes.len() {
                    buf.push(bytes[i + 1]);
                    i += 2;
                    continue;
                }
                if ch == q {
                    quote = None;
                    i += 1;
                    continue;
                }
                buf.push(ch);
                i += 1;
            }
            None => {
                if ch == '"' || ch == '\'' {
                    quote = Some(ch);
                    i += 1;
                    continue;
                }
                if ch == '\\' && i + 1 < bytes.len() {
                    buf.push(bytes[i + 1]);
                    i += 2;
                    continue;
                }
                if ch.is_whitespace() {
                    if !buf.is_empty() {
                        tokens.push(std::mem::take(&mut buf));
                    }
                    i += 1;
                    continue;
                }
                buf.push(ch);
                i += 1;
            }
        }
    }
    if !buf.is_empty() {
        tokens.push(buf);
    }
    if let Some(q) = quote {
        return Err(format!("未闭合的 {} 引号", q));
    }
    if tokens.is_empty() {
        return Err("命令为空".into());
    }
    if tokens[0] != "curl" {
        return Err("命令必须以 curl 开头".into());
    }
    Ok(tokens.into_iter().skip(1).collect())
}

fn parse_headers(text: &str) -> Vec<HeaderBlock> {
    if text.is_empty() {
        return vec![];
    }
    // 段以空行（\r?\n\r?\n）分隔
    let normalized = text.replace("\r\n", "\n");
    normalized
        .split("\n\n")
        .filter(|seg| !seg.trim().is_empty())
        .map(|seg| {
            let mut lines = seg.split('\n');
            let status_line = lines.next().unwrap_or("").to_string();
            let headers = lines
                .filter_map(|line| {
                    let idx = line.find(':')?;
                    Some(HeaderEntry {
                        name: line[..idx].trim().to_string(),
                        value: line[idx + 1..].trim().to_string(),
                    })
                })
                .collect();
            HeaderBlock {
                status_line,
                headers,
            }
        })
        .collect()
}

#[tauri::command]
async fn execute_curl(command: String) -> Result<ExecuteResult, String> {
    if command.trim().is_empty() {
        return Ok(err_result("命令不能为空", None));
    }

    let user_args = match tokenize_curl(&command) {
        Ok(v) => v,
        Err(e) => return Ok(err_result(e, None)),
    };

    // 去掉用户已写的 -i / --include / -I / --head，避免重复
    let cleaned: Vec<String> = user_args
        .into_iter()
        .filter(|a| a != "-i" && a != "--include" && a != "-I" && a != "--head")
        .collect();

    // 临时响应头文件
    let tmp = match tempfile::Builder::new()
        .prefix("curl-h-")
        .suffix(".txt")
        .tempfile()
    {
        Ok(f) => f,
        Err(e) => {
            return Ok(err_result(
                format!("创建临时文件失败：{}", e),
                Some("请检查磁盘权限或可用空间"),
            ));
        }
    };
    let header_path = tmp.path().to_owned();

    let meta_template = serde_json::json!({
        "http_code": "%{http_code}",
        "time_total": "%{time_total}",
        "size_download": "%{size_download}",
        "url_effective": "%{url_effective}",
        "content_type": "%{content_type}"
    })
    .to_string();
    let write_out = format!("{}{}", META_MARKER, meta_template);

    let mut cmd = Command::new("curl");
    cmd.arg("-s")
        .arg("-S")
        .arg("-D")
        .arg(&header_path)
        .arg("-w")
        .arg(&write_out);
    for a in &cleaned {
        cmd.arg(a);
    }

    let started = Instant::now();
    let child_result = cmd
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn();

    let mut child = match child_result {
        Ok(c) => c,
        Err(e) => {
            // 关闭 tempfile 句柄；它会在 drop 时自动删除
            drop(tmp);
            return Ok(err_result(
                format!("curl 启动失败：{}", e),
                Some("请确认本机已安装 curl 命令"),
            ));
        }
    };

    let mut stdout_buf = String::new();
    let mut stderr_buf = String::new();
    if let Some(mut out) = child.stdout.take() {
        let _ = out.read_to_string(&mut stdout_buf).await;
    }
    if let Some(mut err) = child.stderr.take() {
        let _ = err.read_to_string(&mut stderr_buf).await;
    }

    let exit_status = match child.wait().await {
        Ok(s) => s,
        Err(e) => {
            drop(tmp);
            return Ok(err_result(format!("等待 curl 退出失败：{}", e), None));
        }
    };

    // 切出 meta 与 body
    let (body, meta) = match stdout_buf.rfind(META_MARKER) {
        Some(idx) => {
            let body = stdout_buf[..idx].to_string();
            let meta_json = &stdout_buf[idx + META_MARKER.len()..];
            let meta = serde_json::from_str::<CurlMeta>(meta_json).unwrap_or_default();
            (body, meta)
        }
        None => (stdout_buf.clone(), CurlMeta::default()),
    };

    // 读响应头
    let headers_text = tokio::fs::read_to_string(&header_path)
        .await
        .unwrap_or_default();
    drop(tmp); // 删除临时文件

    let header_blocks = parse_headers(&headers_text);

    let exit_code = exit_status.code();
    let ok = matches!(exit_code, Some(0));

    Ok(ExecuteResult {
        ok,
        exit_code,
        stderr: stderr_buf.trim().to_string(),
        status_code: meta
            .http_code
            .as_deref()
            .and_then(|s| s.parse::<u32>().ok()),
        time_ms: meta
            .time_total
            .as_deref()
            .and_then(|s| s.parse::<f64>().ok())
            .map(|s| (s * 1000.0).round() as u32),
        size_bytes: meta
            .size_download
            .as_deref()
            .and_then(|s| s.parse::<u64>().ok()),
        url: meta.url_effective.filter(|s| !s.is_empty()),
        content_type: meta.content_type.filter(|s| !s.is_empty()),
        headers: header_blocks,
        body,
        client_elapsed_ms: Some(started.elapsed().as_millis() as u32),
        error: None,
        hint: None,
        engine: "desktop",
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![execute_curl])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
