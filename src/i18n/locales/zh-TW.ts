import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: '本地執行 · 格式化 · 結果視覺化',
    docsLink: 'curl 文件',
    language: '語言',
  },

  meta: {
    description:
      '在瀏覽器中本地執行、格式化並視覺化 curl 命令。支援 JSON 樹狀 / 心智圖檢視、20 種語言、暗色主題，可打包為無 CORS 限制的桌面應用。',
    keywords:
      'curl, curl 工具, curl 線上, json 格式化, json 樹狀, json 心智圖, http 客戶端, api 測試, postman 替代, REST 客戶端, 介面除錯',
  },

  editor: {
    run: '執行',
    running: '執行中',
    stop: '停止',
    format: '格式化',
    minify: '壓縮',
    decode: '解碼',
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
    requestAborted: '已停止本次請求',
  },

  result: {
    emptyTitle: '尚無結果',
    emptyHint: '在左側編輯 curl 命令，點擊「執行」或按 {hotkey}',
    running: '執行中...',
    runningHint: '點擊「停止」或按 Esc 可中斷請求',
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
    formatLabel: '格式',
    formatText: '文字',
    formatTree: '樹形',
    formatMind: '腦圖',
    searchPlaceholder: '在 JSON 中搜尋…',
    searchEmpty: '無相符項目',
    searchPrev: '上一個相符',
    searchNext: '下一個相符',
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
    favorite: '收藏',
    unfavorite: '取消收藏',
    confirmClearKeepFav: '清空所有非收藏歷史？將保留 {count} 個收藏項目。',
  },

  favorites: {
    title: '收藏夾',
    empty: '暫無收藏，點擊歷史記錄裡的 ☆ 即可加入',
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

  share: {
    button: '分享',
    title: '分享下載連結',
    subtitle: '把桌面版連結傳給朋友或自己的手機',
    copy: '複製連結',
    copied: '連結已複製',
    qrHint: '手機掃碼下載',
    openLink: '開啟下載頁',
    nativeShare: '透過應用程式分享…',
  },
  decode: {
    title: 'curl 解碼檢視',
    empty: '此 curl 命令沒有可解碼的參數',
    sectionQuery: 'URL 查詢參數',
    sectionHeaders: '請求標頭',
    sectionCookies: 'Cookie',
    sectionForm: '表單欄位 (-F)',
    sectionData: '請求主體',
    colKey: '參數名',
    colValue: '值',
    colRaw: '原始值',
    colDecoded: '解碼後',
    colHeaderName: '名稱',
    colHeaderValue: '值',
    copyUrl: '複製 URL',
    copyRaw: '複製原文',
    copyAll: '複製全部',
    copied: '已複製',
    close: '關閉',
    parseErrorTitle: '解析失敗',
    warningsTitle: '解析提示',
    kindText: '純文字',
  },

};

export default messages;
