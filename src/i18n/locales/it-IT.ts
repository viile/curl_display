import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Esecuzione locale · Formattazione · Visualizzazione',
    docsLink: 'docs curl',
    language: 'Lingua',
  },

  meta: {
    description:
      'Esegui, formatta e visualizza comandi curl localmente nel browser. Viste albero / mappa mentale JSON, 20 lingue, modalità scura, app desktop senza limiti CORS.',
    keywords:
      'curl, strumento curl, curl online, formattatore JSON, albero JSON, mappa mentale JSON, client HTTP, test API, alternativa postman, client REST',
  },

  editor: {
    run: 'Esegui',
    running: 'In esecuzione',
    stop: 'Ferma',
    format: 'Formatta',
    minify: 'Comprimi',
    decode: 'Decodifica',
    copy: 'Copia',
    clear: 'Pulisci',
    placeholder:
      'Incolla o digita un comando curl qui...\n\nEsempio:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} righe',
    statusChars: '{n} caratteri',
    statusHint: 'Tab = 2 spazi · {run} esegui · {format} formatta',
  },

  messages: {
    emptyCommand: 'Inserisci un comando curl',
    formatted: 'Formattato',
    formatFailed: 'Formattazione fallita: {msg}',
    minifyFailed: 'Compressione fallita: {msg}',
    copied: 'Copiato negli appunti',
    copyBodyOk: 'Corpo della risposta copiato',
    copyFailed: 'Copia fallita, copia manualmente',
    requestFailed: 'Richiesta fallita: {msg}',
    requestAborted: 'Richiesta interrotta',
  },

  result: {
    emptyTitle: 'Nessun risultato ancora',
    emptyHint: 'Modifica un comando curl a sinistra, poi clicca su «Esegui» o premi {hotkey}',
    running: 'In esecuzione...',
    runningHint: 'Clicca su «Ferma» o premi Esc per interrompere la richiesta',
    metaTime: 'Tempo',
    metaSize: 'Dimensione',
    metaType: 'Tipo',
    metaExit: 'Uscita',
    errorTitle: 'Errore di esecuzione',
    stderrTitle: 'stderr',
    tabBody: 'Corpo',
    tabHeaders: 'Header',
    tabRaw: 'Grezzo',
    actionCopy: 'Copia',
    actionDownload: 'Scarica',
    emptyBody: '(corpo vuoto)',
    emptyHeaders: '(nessun header)',
    formatLabel: 'Formato',
    formatText: 'Testo',
    formatTree: 'Albero',
    formatMind: 'Mappa mentale',
    searchPlaceholder: 'Cerca nel JSON…',
    searchEmpty: 'Nessuna corrispondenza',
    searchPrev: 'Corrispondenza precedente',
    searchNext: 'Corrispondenza successiva',
    searchPlaceholderRegex: 'Cerca con regex…',
    regexToggle: 'Usa espressione regolare',
    regexInvalid: 'Regex non valida',
    searchTargetLabel: 'Ambito di ricerca',
    searchTargetAll: 'Tutti',
    searchTargetKey: 'Chiave',
    searchTargetValue: 'Valore',
  },

  consent: {
    title: 'Consentire il salvataggio della cronologia?',
    message:
      'Usiamo cookie del browser / archiviazione locale per salvare la cronologia delle esecuzioni cURL. I dati restano sul tuo dispositivo e non vengono mai inviati a nessun server.',
    accept: 'Accetta',
    decline: 'Rifiuta',
  },

  history: {
    title: 'Cronologia',
    empty: 'Nessuna cronologia',
    noMatch: 'Nessuna corrispondenza',
    searchPlaceholder: 'Cerca comando o URL...',
    clear: 'Cancella tutto',
    confirmClear: 'Cancellare tutta la cronologia?',
    cleared: 'Cronologia cancellata',
    remove: 'Rimuovi',
    untitled: '(nessun URL)',
    disabledTitle: 'Cronologia disabilitata',
    disabledMsg: 'Accetta l\'archiviazione locale per salvare e visualizzare la cronologia.',
    enabled: 'Cronologia abilitata',
    favorite: 'Aggiungi ai preferiti',
    unfavorite: 'Rimuovi dai preferiti',
    confirmClearKeepFav:
      'Cancellare tutta la cronologia non preferita? {count} preferiti saranno conservati.',
  },

  favorites: {
    title: 'Preferiti',
    empty: 'Nessun preferito — tocca ☆ su un elemento della cronologia per aggiungere',
  },

  theme: {
    title: 'Tema',
    light: 'Chiaro',
    dark: 'Scuro',
    auto: 'Sistema',
  },

  engine: {
    title: 'Motore',
    browser: 'Browser',
    browserHint: 'fetch diretto · senza server · limitato da CORS',
    server: 'Proxy locale',
    serverHint: 'Invoca curl locale · supporto completo · richiede server',
    corsHint:
      'Richiesta fallita, probabilmente bloccata dalla policy CORS del server di destinazione. Passa al «Proxy locale» per inviare la richiesta tramite il tuo curl locale e aggirare le restrizioni del browser.',
    retryWithServer: 'Riprova tramite proxy locale',
    unsupportedTitle: 'Alcune opzioni non sono supportate nel browser',
    desktop: 'Desktop',
    desktopHint: "In esecuzione nell'app desktop · invoca direttamente curl di sistema",
    downloadDesktop: 'Scarica app desktop',
    desktopAppHint:
      "L'app desktop invoca direttamente il curl di sistema — nessuna restrizione CORS, header o TLS, nessun server richiesto.",
  },

  share: {
    button: 'Condividi',
    title: 'Condividi link di download',
    subtitle: "Invia il link dell'app desktop ad amici o al tuo telefono",
    copy: 'Copia link',
    copied: 'Link copiato negli appunti',
    qrHint: 'Scansiona per scaricare sul cellulare',
    openLink: 'Apri pagina di download',
    nativeShare: 'Condividi tramite…',
  },
  decode: {
    title: 'Decodificatore curl',
    empty: 'Nessun parametro decodificabile in questo comando',
    sectionQuery: 'Parametri di query URL',
    sectionHeaders: 'Intestazioni',
    sectionCookies: 'Cookie',
    sectionForm: 'Campi modulo (-F)',
    sectionData: 'Corpo richiesta',
    colKey: 'Chiave',
    colValue: 'Valore',
    colRaw: 'Originale',
    colDecoded: 'Decodificato',
    colHeaderName: 'Nome',
    colHeaderValue: 'Valore',
    copyUrl: 'Copia URL',
    copyRaw: 'Copia originale',
    copyAll: 'Copia tutto',
    copied: 'Copiato',
    close: 'Chiudi',
    parseErrorTitle: 'Parsing fallito',
    warningsTitle: 'Avvisi',
    kindText: 'Testo',
  },

};

export default messages;
