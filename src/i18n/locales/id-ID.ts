import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Jalankan lokal · Format · Visualisasi',
    docsLink: 'dokumen curl',
    language: 'Bahasa',
  },

  meta: {
    description:
      'Jalankan, format, dan visualisasikan perintah curl secara lokal di browser. Tampilan JSON pohon / peta pikiran, 20 bahasa, mode gelap, dan aplikasi desktop tanpa batasan CORS.',
    keywords:
      'curl, alat curl, curl online, formatter JSON, pohon JSON, peta pikiran JSON, klien HTTP, pengujian API, alternatif postman, klien REST',
  },

  editor: {
    run: 'Jalankan',
    running: 'Berjalan',
    format: 'Format',
    minify: 'Perkecil',
    decode: 'Dekode',
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
    formatLabel: 'Format',
    formatText: 'Teks',
    formatTree: 'Pohon',
    formatMind: 'Peta pikiran',
    searchPlaceholder: 'Cari di JSON…',
    searchEmpty: 'Tidak ada hasil',
    searchPrev: 'Hasil sebelumnya',
    searchNext: 'Hasil berikutnya',
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
    favorite: 'Tambah ke favorit',
    unfavorite: 'Hapus dari favorit',
    confirmClearKeepFav:
      'Hapus semua riwayat non-favorit? {count} favorit akan dipertahankan.',
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

  share: {
    button: 'Bagikan',
    title: 'Bagikan tautan unduh',
    subtitle: 'Kirim tautan aplikasi desktop ke teman atau ke ponsel Anda',
    copy: 'Salin tautan',
    copied: 'Tautan disalin ke papan klip',
    qrHint: 'Pindai untuk mengunduh di ponsel',
    openLink: 'Buka halaman unduh',
    nativeShare: 'Bagikan melalui…',
  },
  decode: {
    title: 'Dekoder curl',
    empty: 'Tidak ada parameter yang dapat didekode di perintah ini',
    sectionQuery: 'Parameter kueri URL',
    sectionHeaders: 'Header',
    sectionCookies: 'Cookie',
    sectionForm: 'Bidang formulir (-F)',
    sectionData: 'Isi permintaan',
    colKey: 'Kunci',
    colValue: 'Nilai',
    colRaw: 'Asli',
    colDecoded: 'Didekode',
    colHeaderName: 'Nama',
    colHeaderValue: 'Nilai',
    copyUrl: 'Salin URL',
    copyRaw: 'Salin asli',
    copyAll: 'Salin semua',
    copied: 'Disalin',
    close: 'Tutup',
    parseErrorTitle: 'Gagal parsing',
    warningsTitle: 'Peringatan',
    kindText: 'Teks',
  },

};

export default messages;
