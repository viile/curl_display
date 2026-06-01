# cURL Runner

一个适配 PC 的 curl 工具站：左右分栏，左边输入 / 格式化 curl 命令，点击按钮在本地执行，右边可视化展示状态码、响应头、响应体。

## 技术栈

- 前端：Vue 3 + Vite + TypeScript + Element Plus
- 后端：Node.js + Express（调用本机 `curl` 进程执行命令）

## 功能

- ✅ 左右分栏 PC 布局，暗色主题
- ✅ curl 命令编辑器（行号、Tab=2 空格、快捷键）
- ✅ 一键格式化：每个 flag 一行，自动加续行符
- ✅ 压缩为单行 / 复制 / 清空
- ✅ 调用本机 `curl` 执行（支持任意 flag、POST/GET、header、body、cookies 等）
- ✅ 结果展示：状态码 / 耗时 / 大小 / Content-Type / 响应头表格 / 响应体（JSON 自动美化高亮）
- ✅ 支持复制响应、下载响应文件
- ✅ 快捷键：`⌘/Ctrl + Enter` 执行，`⌘/Ctrl + Shift + F` 格式化

## 开发启动

```bash
npm install
npm run dev
```

- 前端：<http://localhost:5173>
- 后端：<http://localhost:8787>（Vite 已配置 `/api` 代理）

## 前置条件

本机需要安装 `curl` 命令（macOS / Linux 自带；Windows 推荐 Git Bash 或 WSL）。

## 安全提示

后端通过 `child_process.spawn('curl', argv)` 执行命令，**不经过系统 shell**，且仅会调用 `curl` 二进制本身，所以理论上不存在 shell 注入风险。但请注意：该服务会按用户输入向任意 URL 发起请求，**仅推荐本机或可信网络内使用**，不要直接对公网暴露。
