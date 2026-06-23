import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Run locally · Format · Visualize',
    docsLink: 'curl docs',
    language: 'Language',
  },

  meta: {
    description:
      'Run, format and visualize curl commands locally in your browser. JSON tree / mind-map views, 20 languages, dark mode, and a desktop build with no CORS limits.',
    keywords:
      'curl, curl runner, curl gui, curl online, json viewer, json formatter, json tree, json mind map, http client, api testing, postman alternative, rest client',
  },

  editor: {
    run: 'Run',
    running: 'Running',
    stop: 'Stop',
    format: 'Format',
    minify: 'Minify',
    decode: 'Decode',
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
    requestAborted: 'Request stopped',
  },

  result: {
    emptyTitle: 'No result yet',
    emptyHint: 'Edit a curl command on the left, then click "Run" or press {hotkey}',
    running: 'Running...',
    runningHint: 'Click "Stop" or press Esc to abort the request',
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
    formatLabel: 'Format',
    formatText: 'Text',
    formatTree: 'Tree',
    formatMind: 'Mind map',
    searchPlaceholder: 'Search in JSON…',
    searchEmpty: 'No matches',
    searchPrev: 'Previous match',
    searchNext: 'Next match',
    searchPlaceholderRegex: 'Search by regex…',
    regexToggle: 'Use regular expression',
    regexInvalid: 'Invalid regex',
    searchTargetLabel: 'Search target',
    searchTargetAll: 'All',
    searchTargetKey: 'Key',
    searchTargetValue: 'Value',
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
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
    confirmClearKeepFav:
      'Clear all non-favorite history? {count} favorited item(s) will be kept.',
  },

  favorites: {
    title: 'Favorites',
    empty: 'No favorites yet — tap ☆ on any history item to add',
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

  share: {
    button: 'Share',
    title: 'Share download link',
    subtitle: 'Send the desktop app link to friends or your own phone',
    copy: 'Copy link',
    copied: 'Link copied to clipboard',
    qrHint: 'Scan to download on mobile',
    openLink: 'Open download page',
    nativeShare: 'Share via…',
  },

  decode: {
    title: 'curl decoder',
    empty: 'No decodable parameters in this curl command',
    sectionQuery: 'URL query parameters',
    sectionHeaders: 'Headers',
    sectionCookies: 'Cookies',
    sectionForm: 'Form fields (-F)',
    sectionData: 'Request body',
    colKey: 'Key',
    colValue: 'Value',
    colRaw: 'Raw',
    colDecoded: 'Decoded',
    colHeaderName: 'Name',
    colHeaderValue: 'Value',
    copyUrl: 'Copy URL',
    copyRaw: 'Copy raw',
    copyAll: 'Copy all',
    copied: 'Copied',
    close: 'Close',
    parseErrorTitle: 'Parse failed',
    warningsTitle: 'Warnings',
    kindText: 'Text',
  },
};

export default messages;
