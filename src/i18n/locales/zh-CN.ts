const messages = {
  app: {
    title: 'cURL Runner',
    subtitle: '本地执行 · 格式化 · 结果可视化',
    docsLink: 'curl 文档',
    language: '语言',
  },

  meta: {
    description:
      '在浏览器中本地执行、格式化和可视化 curl 命令。支持 JSON 树形 / 脑图视图、20 种语言、暗色主题，并可打包为无 CORS 限制的桌面应用。',
    keywords:
      'curl, curl 工具, curl 在线, json 格式化, json 树形, json 脑图, http 客户端, api 测试, postman 替代, REST 客户端, 接口调试',
  },

  editor: {
    run: '执行',
    running: '执行中',
    format: '格式化',
    minify: '压缩',
    copy: '复制',
    clear: '清空',
    placeholder:
      '在此粘贴或输入 curl 命令...\n\n示例：\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} 行',
    statusChars: '{n} 字符',
    statusHint: 'Tab = 2 空格 · {run} 执行 · {format} 格式化',
  },

  messages: {
    emptyCommand: '请输入 curl 命令',
    formatted: '已格式化',
    formatFailed: '格式化失败：{msg}',
    minifyFailed: '压缩失败：{msg}',
    copied: '已复制到剪贴板',
    copyBodyOk: '响应体已复制',
    copyFailed: '复制失败，请手动复制',
    requestFailed: '请求失败：{msg}',
  },

  result: {
    emptyTitle: '还没有结果',
    emptyHint: '在左侧编辑 curl 命令，点击「执行」或按 {hotkey}',
    running: '正在执行...',
    metaTime: '耗时',
    metaSize: '大小',
    metaType: '类型',
    metaExit: '退出',
    errorTitle: '执行错误',
    stderrTitle: 'stderr',
    tabBody: '响应体',
    tabHeaders: '响应头',
    tabRaw: '原始',
    actionCopy: '复制',
    actionDownload: '下载',
    emptyBody: '（空响应体）',
    emptyHeaders: '（无响应头）',
    formatLabel: '格式',
    formatText: '文本',
    formatTree: '树形',
    formatMind: '脑图',
  },

  consent: {
    title: '允许保存历史记录？',
    message:
      '我们会使用浏览器 Cookie / 本地存储保存您的 cURL 执行历史，仅存放在您本机，不会上传到任何服务器。',
    accept: '同意',
    decline: '拒绝',
  },

  history: {
    title: '历史',
    empty: '暂无历史记录',
    noMatch: '没有匹配的记录',
    searchPlaceholder: '搜索命令或 URL...',
    clear: '清空全部',
    confirmClear: '确定要清空所有历史记录吗？',
    cleared: '历史已清空',
    remove: '删除',
    untitled: '(无 URL)',
    disabledTitle: '历史记录未启用',
    disabledMsg: '同意使用本地存储后即可保存并查看执行历史。',
    enabled: '历史记录已启用',
  },

  theme: {
    title: '主题',
    light: '浅色',
    dark: '深色',
    auto: '跟随系统',
  },

  engine: {
    title: '执行引擎',
    browser: '浏览器',
    browserHint: '直接 fetch · 无需 server · 受 CORS 限制',
    server: '本地代理',
    serverHint: '调用本机 curl · 完整支持 · 需启动 server',
    corsHint:
      '请求失败，多半是目标服务器的 CORS 策略限制。切换到「本地代理」可由本机 curl 发起请求，绕过浏览器限制。',
    retryWithServer: '改用本地代理重试',
    unsupportedTitle: '部分参数浏览器不支持',
    desktop: '桌面应用',
    desktopHint: '已运行在桌面应用内 · 直接调用系统 curl',
    downloadDesktop: '下载桌面应用',
    desktopAppHint: '桌面版直接调用系统 curl，无 CORS / header / TLS 任何限制，无需启动 server。',
  },
};

export default messages;
