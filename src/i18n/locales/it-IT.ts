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
    format: 'Formatta',
    minify: 'Comprimi',
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
  },

  result: {
    emptyTitle: 'Nessun risultato ancora',
    emptyHint: 'Modifica un comando curl a sinistra, poi clicca su «Esegui» o premi {hotkey}',
    running: 'In esecuzione...',
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
};

export default messages;
