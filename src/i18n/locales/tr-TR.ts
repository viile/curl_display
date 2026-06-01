import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Yerel çalıştırma · Biçimlendir · Görselleştir',
    docsLink: 'curl belgeleri',
    language: 'Dil',
  },

  editor: {
    run: 'Çalıştır',
    running: 'Çalışıyor',
    format: 'Biçimlendir',
    minify: 'Küçült',
    copy: 'Kopyala',
    clear: 'Temizle',
    placeholder:
      'Buraya bir curl komutu yapıştırın veya yazın...\n\nÖrnek:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} satır',
    statusChars: '{n} karakter',
    statusHint: 'Tab = 2 boşluk · {run} çalıştır · {format} biçimlendir',
  },

  messages: {
    emptyCommand: 'Lütfen bir curl komutu girin',
    formatted: 'Biçimlendirildi',
    formatFailed: 'Biçimlendirme başarısız: {msg}',
    minifyFailed: 'Küçültme başarısız: {msg}',
    copied: 'Panoya kopyalandı',
    copyBodyOk: 'Yanıt gövdesi kopyalandı',
    copyFailed: 'Kopyalanamadı, lütfen elle kopyalayın',
    requestFailed: 'İstek başarısız: {msg}',
  },

  result: {
    emptyTitle: 'Henüz sonuç yok',
    emptyHint: 'Soldaki curl komutunu düzenleyin, sonra «Çalıştır»a tıklayın veya {hotkey} tuşuna basın',
    running: 'Çalışıyor...',
    metaTime: 'Süre',
    metaSize: 'Boyut',
    metaType: 'Tür',
    metaExit: 'Çıkış',
    errorTitle: 'Yürütme hatası',
    stderrTitle: 'stderr',
    tabBody: 'Gövde',
    tabHeaders: 'Başlıklar',
    tabRaw: 'Ham',
    actionCopy: 'Kopyala',
    actionDownload: 'İndir',
    emptyBody: '(boş gövde)',
    emptyHeaders: '(başlık yok)',
  },

  consent: {
    title: 'Geçmiş kaydetmeye izin verilsin mi?',
    message:
      'cURL yürütme geçmişinizi kaydetmek için tarayıcı çerezlerini / yerel depolamayı kullanırız. Veriler yalnızca cihazınızda kalır ve hiçbir sunucuya gönderilmez.',
    accept: 'Kabul et',
    decline: 'Reddet',
  },

  history: {
    title: 'Geçmiş',
    empty: 'Henüz geçmiş yok',
    noMatch: 'Eşleşen kayıt yok',
    searchPlaceholder: 'Komut veya URL ara...',
    clear: 'Tümünü temizle',
    confirmClear: 'Tüm geçmiş silinsin mi?',
    cleared: 'Geçmiş temizlendi',
    remove: 'Kaldır',
    untitled: '(URL yok)',
    disabledTitle: 'Geçmiş devre dışı',
    disabledMsg: 'Yerel depolamayı kabul ederek yürütme geçmişini kaydedip görebilirsiniz.',
    enabled: 'Geçmiş etkinleştirildi',
  },

  theme: {
    title: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    auto: 'Otomatik',
  },

  engine: {
    title: 'Motor',
    browser: 'Tarayıcı',
    browserHint: 'Doğrudan fetch · sunucusuz · CORS sınırlı',
    server: 'Yerel proxy',
    serverHint: 'Yerel curl çağırır · tam destek · sunucu gerekir',
    corsHint:
      'İstek başarısız oldu, büyük olasılıkla hedef sunucunun CORS politikasıyla engellendi. İsteği yerel curl üzerinden göndermek ve tarayıcı kısıtlamalarını aşmak için «Yerel proxy»ye geçin.',
    retryWithServer: 'Yerel proxy ile yeniden dene',
    unsupportedTitle: 'Bazı bayraklar tarayıcıda desteklenmiyor',
    desktop: 'Masaüstü',
    desktopHint: "Masaüstü uygulamasında çalışıyor · sistem curl'unu doğrudan çağırır",
    downloadDesktop: 'Masaüstü uygulamasını indir',
    desktopAppHint:
      "Masaüstü uygulaması sistem curl'unu doğrudan çağırır — CORS, başlık veya TLS kısıtlaması yok, sunucu gerekmez.",
  },
};

export default messages;
