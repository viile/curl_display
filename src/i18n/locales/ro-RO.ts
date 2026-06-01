import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Execuție locală · Formatare · Vizualizare',
    docsLink: 'documentație curl',
    language: 'Limbă',
  },

  editor: {
    run: 'Execută',
    running: 'În execuție',
    format: 'Formatează',
    minify: 'Compactează',
    copy: 'Copiază',
    clear: 'Șterge',
    placeholder:
      'Lipește sau scrie o comandă curl aici...\n\nExemplu:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} linii',
    statusChars: '{n} caractere',
    statusHint: 'Tab = 2 spații · {run} execută · {format} formatează',
  },

  messages: {
    emptyCommand: 'Introdu o comandă curl',
    formatted: 'Formatat',
    formatFailed: 'Formatarea a eșuat: {msg}',
    minifyFailed: 'Compactarea a eșuat: {msg}',
    copied: 'Copiat în clipboard',
    copyBodyOk: 'Corpul răspunsului a fost copiat',
    copyFailed: 'Copierea a eșuat, copiază manual',
    requestFailed: 'Cererea a eșuat: {msg}',
  },

  result: {
    emptyTitle: 'Niciun rezultat încă',
    emptyHint: 'Editează o comandă curl în stânga, apoi apasă «Execută» sau {hotkey}',
    running: 'În execuție...',
    metaTime: 'Timp',
    metaSize: 'Dimensiune',
    metaType: 'Tip',
    metaExit: 'Ieșire',
    errorTitle: 'Eroare de execuție',
    stderrTitle: 'stderr',
    tabBody: 'Corp',
    tabHeaders: 'Antete',
    tabRaw: 'Brut',
    actionCopy: 'Copiază',
    actionDownload: 'Descarcă',
    emptyBody: '(corp gol)',
    emptyHeaders: '(fără antete)',
  },

  consent: {
    title: 'Permiteți salvarea istoricului?',
    message:
      'Folosim cookie-uri / spațiul de stocare local al browserului pentru a salva istoricul execuțiilor cURL. Datele rămân pe dispozitivul tău și nu sunt niciodată trimise către niciun server.',
    accept: 'Accept',
    decline: 'Refuz',
  },

  history: {
    title: 'Istoric',
    empty: 'Niciun istoric încă',
    noMatch: 'Nicio potrivire',
    searchPlaceholder: 'Caută comandă sau URL...',
    clear: 'Șterge tot',
    confirmClear: 'Ștergi tot istoricul?',
    cleared: 'Istoric șters',
    remove: 'Elimină',
    untitled: '(fără URL)',
    disabledTitle: 'Istoric dezactivat',
    disabledMsg: 'Acceptă stocarea locală pentru a salva și vedea istoricul.',
    enabled: 'Istoric activat',
  },

  theme: {
    title: 'Temă',
    light: 'Luminoasă',
    dark: 'Întunecată',
    auto: 'Sistem',
  },

  engine: {
    title: 'Motor',
    browser: 'Browser',
    browserHint: 'fetch direct · fără server · limitat de CORS',
    server: 'Proxy local',
    serverHint: 'Invocă curl local · suport complet · necesită server',
    corsHint:
      'Cererea a eșuat, probabil blocată de politica CORS a serverului țintă. Treci la «Proxy local» pentru a trimite cererea prin curl local și a ocoli restricțiile browserului.',
    retryWithServer: 'Reîncearcă prin proxy local',
    unsupportedTitle: 'Unele opțiuni nu sunt acceptate în browser',
    desktop: 'Desktop',
    desktopHint: 'Rulează în aplicația desktop · invocă direct curl-ul sistemului',
    downloadDesktop: 'Descarcă aplicația desktop',
    desktopAppHint:
      'Aplicația desktop invocă direct curl-ul sistemului — fără restricții CORS, anteturi sau TLS, fără server.',
  },
};

export default messages;
