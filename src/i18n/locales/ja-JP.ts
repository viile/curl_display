import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'ローカルで実行 · フォーマット · 結果を可視化',
    docsLink: 'curl ドキュメント',
    language: '言語',
  },

  meta: {
    description:
      'ブラウザで curl コマンドをローカル実行・整形・可視化。JSON ツリー / マインドマップ表示、20 言語対応、ダークモード、CORS 制約のないデスクトップアプリ版あり。',
    keywords:
      'curl, curl ツール, curl オンライン, JSON 整形, JSON ツリー, JSON マインドマップ, HTTP クライアント, API テスト, postman 代替, REST クライアント',
  },

  editor: {
    run: '実行',
    running: '実行中',
    format: 'フォーマット',
    minify: '圧縮',
    decode: 'デコード',
    copy: 'コピー',
    clear: 'クリア',
    placeholder:
      'ここに curl コマンドを貼り付けるか入力してください...\n\n例:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} 行',
    statusChars: '{n} 文字',
    statusHint: 'Tab = 2 スペース · {run} 実行 · {format} フォーマット',
  },

  messages: {
    emptyCommand: 'curl コマンドを入力してください',
    formatted: 'フォーマット完了',
    formatFailed: 'フォーマット失敗: {msg}',
    minifyFailed: '圧縮失敗: {msg}',
    copied: 'クリップボードにコピーしました',
    copyBodyOk: 'レスポンスボディをコピーしました',
    copyFailed: 'コピーに失敗しました。手動でコピーしてください',
    requestFailed: 'リクエスト失敗: {msg}',
  },

  result: {
    emptyTitle: 'まだ結果はありません',
    emptyHint: '左側で curl コマンドを編集し、「実行」をクリックするか {hotkey} を押してください',
    running: '実行中...',
    metaTime: '時間',
    metaSize: 'サイズ',
    metaType: 'タイプ',
    metaExit: '終了',
    errorTitle: '実行エラー',
    stderrTitle: 'stderr',
    tabBody: 'ボディ',
    tabHeaders: 'ヘッダー',
    tabRaw: '生データ',
    actionCopy: 'コピー',
    actionDownload: 'ダウンロード',
    emptyBody: '(空のボディ)',
    emptyHeaders: '(ヘッダーなし)',
    formatLabel: '表示形式',
    formatText: 'テキスト',
    formatTree: 'ツリー',
    formatMind: 'マインドマップ',
    searchPlaceholder: 'JSON を検索…',
    searchEmpty: '一致なし',
    searchPrev: '前の一致',
    searchNext: '次の一致',
  },

  consent: {
    title: '履歴の保存を許可しますか？',
    message:
      'ブラウザの Cookie / ローカルストレージを使って cURL の実行履歴を保存します。データはお使いのデバイスに留まり、サーバーには送信されません。',
    accept: '許可する',
    decline: '拒否する',
  },

  history: {
    title: '履歴',
    empty: '履歴はまだありません',
    noMatch: '一致する履歴がありません',
    searchPlaceholder: 'コマンドや URL を検索...',
    clear: 'すべてクリア',
    confirmClear: 'すべての履歴をクリアしますか？',
    cleared: '履歴をクリアしました',
    remove: '削除',
    untitled: '(URL なし)',
    disabledTitle: '履歴は無効です',
    disabledMsg: 'ローカルストレージを許可すると履歴を保存・閲覧できます。',
    enabled: '履歴を有効化しました',
    favorite: 'お気に入りに追加',
    unfavorite: 'お気に入りから削除',
    confirmClearKeepFav:
      'お気に入り以外をすべて削除しますか？{count} 件のお気に入りは保持されます。',
  },

  theme: {
    title: 'テーマ',
    light: 'ライト',
    dark: 'ダーク',
    auto: 'システム',
  },

  engine: {
    title: '実行エンジン',
    browser: 'ブラウザ',
    browserHint: 'fetch を直接実行 · サーバー不要 · CORS 制限あり',
    server: 'ローカルプロキシ',
    serverHint: 'ローカルの curl を起動 · フル対応 · サーバー必要',
    corsHint:
      'リクエストが失敗しました。対象サーバーの CORS ポリシーにより遮断されている可能性が高いです。「ローカルプロキシ」に切り替えると、ローカルの curl 経由でリクエストを送信しブラウザの制約を回避できます。',
    retryWithServer: 'ローカルプロキシで再試行',
    unsupportedTitle: '一部のフラグはブラウザではサポートされません',
    desktop: 'デスクトップ',
    desktopHint: 'デスクトップアプリで実行中 · システム curl を直接呼び出し',
    downloadDesktop: 'デスクトップアプリをダウンロード',
    desktopAppHint:
      'デスクトップ版はシステムの curl を直接呼び出します。CORS / ヘッダ / TLS の制約なし、サーバー不要。',
  },

  share: {
    button: '共有',
    title: 'ダウンロードリンクを共有',
    subtitle: 'デスクトップ版のリンクを友人やご自身のスマホへ',
    copy: 'リンクをコピー',
    copied: 'リンクをコピーしました',
    qrHint: 'スキャンしてモバイルでダウンロード',
    openLink: 'ダウンロードページを開く',
    nativeShare: 'アプリで共有…',
  },
  decode: {
    title: 'curl デコードビュー',
    empty: 'デコード可能なパラメータがありません',
    sectionQuery: 'URL クエリパラメータ',
    sectionHeaders: 'ヘッダー',
    sectionCookies: 'Cookie',
    sectionForm: 'フォーム項目 (-F)',
    sectionData: 'リクエストボディ',
    colKey: 'キー',
    colValue: '値',
    colRaw: '生データ',
    colDecoded: 'デコード後',
    colHeaderName: '名前',
    colHeaderValue: '値',
    copyUrl: 'URL をコピー',
    copyRaw: '原文をコピー',
    copyAll: 'すべてコピー',
    copied: 'コピーしました',
    close: '閉じる',
    parseErrorTitle: '解析失敗',
    warningsTitle: '警告',
    kindText: 'テキスト',
  },

};

export default messages;
