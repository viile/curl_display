import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Run locally · Format · Visualize',
    docsLink: 'curl docs',
    language: 'Language',
  },

  editor: {
    run: 'Run',
    running: 'Running',
    format: 'Format',
    minify: 'Minify',
    copy: 'Copy',
    clear: 'Clear',
    placeholder:
      'Paste or type a curl command here...\n\nExample:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} lines',
    statusChars: '{n} chars',
    statusHint: 'Tab = 2 spaces · {run} run · {format} format',
  },

  messages: {
    emptyCommand: 'Please enter a curl command',
    formatted: 'Formatted',
    formatFailed: 'Format failed: {msg}',
    minifyFailed: 'Minify failed: {msg}',
    copied: 'Copied to clipboard',
    copyBodyOk: 'Response body copied',
    copyFailed: 'Copy failed, please copy manually',
    requestFailed: 'Request failed: {msg}',
  },

  result: {
    emptyTitle: 'No result yet',
    emptyHint: 'Edit a curl command on the left, then click "Run" or press {hotkey}',
    running: 'Running...',
    metaTime: 'Time',
    metaSize: 'Size',
    metaType: 'Type',
    metaExit: 'Exit',
    errorTitle: 'Execution error',
    stderrTitle: 'stderr',
    tabBody: 'Body',
    tabHeaders: 'Headers',
    tabRaw: 'Raw',
    actionCopy: 'Copy',
    actionDownload: 'Download',
    emptyBody: '(empty body)',
    emptyHeaders: '(no headers)',
  },

  consent: {
    title: 'Allow saving history?',
    message:
      'We use browser cookies / local storage to save your cURL execution history. Data stays on your device and is never uploaded to any server.',
    accept: 'Accept',
    decline: 'Decline',
  },

  history: {
    title: 'History',
    empty: 'No history yet',
    noMatch: 'No matching entries',
    searchPlaceholder: 'Search command or URL...',
    clear: 'Clear all',
    confirmClear: 'Clear all history?',
    cleared: 'History cleared',
    remove: 'Remove',
    untitled: '(no URL)',
    disabledTitle: 'History is disabled',
    disabledMsg: 'Accept local storage to save and view your execution history.',
    enabled: 'History enabled',
  },

  theme: {
    title: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'System',
  },

  engine: {
    title: 'Engine',
    browser: 'Browser',
    browserHint: 'Direct fetch · no server · CORS-limited',
    server: 'Local proxy',
    serverHint: 'Spawns local curl · full support · server required',
    corsHint:
      "Request failed, likely blocked by the target server's CORS policy. Switch to the local proxy to dispatch requests through your local curl and bypass browser restrictions.",
    retryWithServer: 'Retry via local proxy',
    unsupportedTitle: 'Some flags are not supported in the browser',
    desktop: 'Desktop',
    desktopHint: 'Running inside the desktop app · invokes system curl directly',
    downloadDesktop: 'Download desktop app',
    desktopAppHint:
      'The desktop app invokes your system curl directly — no CORS, no header restrictions, no TLS limits, no server required.',
  },
};

export default messages;
