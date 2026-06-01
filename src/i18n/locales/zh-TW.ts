import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: '本地執行 · 格式化 · 結果視覺化',
    docsLink: 'curl 文件',
    language: '語言',
  },

  editor: {
    run: '執行',
    running: '執行中',
    format: '格式化',
    minify: '壓縮',
    copy: '複製',
    clear: '清空',
    placeholder:
      '在此貼上或輸入 curl 命令...\n\n範例：\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} 行',
    statusChars: '{n} 字元',
    statusHint: 'Tab = 2 空格 · {run} 執行 · {format} 格式化',
  },

  messages: {
    emptyCommand: '請輸入 curl 命令',
    formatted: '已格式化',
    formatFailed: '格式化失敗：{msg}',
    minifyFailed: '壓縮失敗：{msg}',
    copied: '已複製到剪貼簿',
    copyBodyOk: '回應主體已複製',
    copyFailed: '複製失敗，請手動複製',
    requestFailed: '請求失敗：{msg}',
  },

  result: {
    emptyTitle: '尚無結果',
    emptyHint: '在左側編輯 curl 命令，點擊「執行」或按 {hotkey}',
    running: '執行中...',
    metaTime: '耗時',
    metaSize: '大小',
    metaType: '類型',
    metaExit: '結束',
    errorTitle: '執行錯誤',
    stderrTitle: 'stderr',
    tabBody: '回應主體',
    tabHeaders: '回應標頭',
    tabRaw: '原始',
    actionCopy: '複製',
    actionDownload: '下載',
    emptyBody: '（空回應主體）',
    emptyHeaders: '（無回應標頭）',
  },

  consent: {
    title: '允許儲存歷史記錄？',
    message:
      '我們會使用瀏覽器 Cookie / 本地儲存保存您的 cURL 執行歷史，僅存放於本機，不會上傳至任何伺服器。',
    accept: '同意',
    decline: '拒絕',
  },

  history: {
    title: '歷史',
    empty: '尚無歷史記錄',
    noMatch: '沒有符合的記錄',
    searchPlaceholder: '搜尋命令或 URL...',
    clear: '清空全部',
    confirmClear: '確定要清空所有歷史記錄嗎？',
    cleared: '歷史已清空',
    remove: '刪除',
    untitled: '（無 URL）',
    disabledTitle: '歷史記錄未啟用',
    disabledMsg: '同意使用本地儲存後即可保存並檢視執行歷史。',
    enabled: '歷史記錄已啟用',
  },

  theme: {
    title: '主題',
    light: '淺色',
    dark: '深色',
    auto: '跟隨系統',
  },

  engine: {
    title: '執行引擎',
    browser: '瀏覽器',
    browserHint: '直接 fetch · 無需 server · 受 CORS 限制',
    server: '本地代理',
    serverHint: '呼叫本機 curl · 完整支援 · 需啟動 server',
    corsHint:
      '請求失敗，多半是目標伺服器的 CORS 策略限制。切換到「本地代理」可由本機 curl 發起請求，繞過瀏覽器限制。',
    retryWithServer: '改用本地代理重試',
    unsupportedTitle: '部分參數瀏覽器不支援',
    desktop: '桌面應用',
    desktopHint: '已執行在桌面應用內 · 直接呼叫系統 curl',
    downloadDesktop: '下載桌面應用',
    desktopAppHint: '桌面版直接呼叫系統 curl，無 CORS / header / TLS 任何限制，無需啟動 server。',
  },
};

export default messages;
