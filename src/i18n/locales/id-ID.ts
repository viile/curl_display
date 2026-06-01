import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Jalankan lokal · Format · Visualisasi',
    docsLink: 'dokumen curl',
    language: 'Bahasa',
  },

  editor: {
    run: 'Jalankan',
    running: 'Berjalan',
    format: 'Format',
    minify: 'Perkecil',
    copy: 'Salin',
    clear: 'Bersihkan',
    placeholder:
      'Tempel atau ketik perintah curl di sini...\n\nContoh:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} baris',
    statusChars: '{n} karakter',
    statusHint: 'Tab = 2 spasi · {run} jalankan · {format} format',
  },

  messages: {
    emptyCommand: 'Silakan masukkan perintah curl',
    formatted: 'Diformat',
    formatFailed: 'Format gagal: {msg}',
    minifyFailed: 'Perkecil gagal: {msg}',
    copied: 'Disalin ke clipboard',
    copyBodyOk: 'Body respons disalin',
    copyFailed: 'Penyalinan gagal, salin secara manual',
    requestFailed: 'Permintaan gagal: {msg}',
  },

  result: {
    emptyTitle: 'Belum ada hasil',
    emptyHint: 'Edit perintah curl di kiri, lalu klik «Jalankan» atau tekan {hotkey}',
    running: 'Berjalan...',
    metaTime: 'Waktu',
    metaSize: 'Ukuran',
    metaType: 'Tipe',
    metaExit: 'Keluar',
    errorTitle: 'Kesalahan eksekusi',
    stderrTitle: 'stderr',
    tabBody: 'Body',
    tabHeaders: 'Headers',
    tabRaw: 'Mentah',
    actionCopy: 'Salin',
    actionDownload: 'Unduh',
    emptyBody: '(body kosong)',
    emptyHeaders: '(tidak ada headers)',
  },

  consent: {
    title: 'Izinkan menyimpan riwayat?',
    message:
      'Kami menggunakan cookie / penyimpanan lokal browser untuk menyimpan riwayat eksekusi cURL. Data tetap di perangkat Anda dan tidak pernah dikirim ke server mana pun.',
    accept: 'Terima',
    decline: 'Tolak',
  },

  history: {
    title: 'Riwayat',
    empty: 'Belum ada riwayat',
    noMatch: 'Tidak ada yang cocok',
    searchPlaceholder: 'Cari perintah atau URL...',
    clear: 'Hapus semua',
    confirmClear: 'Hapus semua riwayat?',
    cleared: 'Riwayat dihapus',
    remove: 'Hapus',
    untitled: '(tanpa URL)',
    disabledTitle: 'Riwayat dinonaktifkan',
    disabledMsg: 'Terima penyimpanan lokal untuk menyimpan dan melihat riwayat.',
    enabled: 'Riwayat diaktifkan',
  },

  theme: {
    title: 'Tema',
    light: 'Terang',
    dark: 'Gelap',
    auto: 'Sistem',
  },

  engine: {
    title: 'Mesin',
    browser: 'Browser',
    browserHint: 'fetch langsung · tanpa server · dibatasi CORS',
    server: 'Proxy lokal',
    serverHint: 'Memanggil curl lokal · dukungan penuh · perlu server',
    corsHint:
      'Permintaan gagal, kemungkinan diblokir oleh kebijakan CORS server target. Beralih ke «Proxy lokal» untuk mengirim permintaan via curl lokal dan melewati pembatasan browser.',
    retryWithServer: 'Coba lagi via proxy lokal',
    unsupportedTitle: 'Beberapa flag tidak didukung di browser',
    desktop: 'Aplikasi Desktop',
    desktopHint: 'Berjalan di aplikasi desktop · memanggil curl sistem secara langsung',
    downloadDesktop: 'Unduh aplikasi desktop',
    desktopAppHint:
      'Aplikasi desktop memanggil curl sistem secara langsung — tanpa batasan CORS, header, atau TLS, tanpa perlu server.',
  },
};

export default messages;
