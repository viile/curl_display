import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Lokal ausführen · Formatieren · Visualisieren',
    docsLink: 'curl Doku',
    language: 'Sprache',
  },

  editor: {
    run: 'Ausführen',
    running: 'Läuft',
    format: 'Formatieren',
    minify: 'Komprimieren',
    copy: 'Kopieren',
    clear: 'Leeren',
    placeholder:
      'curl-Befehl hier einfügen oder eingeben...\n\nBeispiel:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} Zeilen',
    statusChars: '{n} Zeichen',
    statusHint: 'Tab = 2 Leerzeichen · {run} ausführen · {format} formatieren',
  },

  messages: {
    emptyCommand: 'Bitte einen curl-Befehl eingeben',
    formatted: 'Formatiert',
    formatFailed: 'Formatieren fehlgeschlagen: {msg}',
    minifyFailed: 'Komprimieren fehlgeschlagen: {msg}',
    copied: 'In die Zwischenablage kopiert',
    copyBodyOk: 'Antwortinhalt kopiert',
    copyFailed: 'Kopieren fehlgeschlagen, bitte manuell kopieren',
    requestFailed: 'Anfrage fehlgeschlagen: {msg}',
  },

  result: {
    emptyTitle: 'Noch kein Ergebnis',
    emptyHint: 'Bearbeite links einen curl-Befehl, klicke dann auf „Ausführen" oder drücke {hotkey}',
    running: 'Wird ausgeführt...',
    metaTime: 'Zeit',
    metaSize: 'Größe',
    metaType: 'Typ',
    metaExit: 'Beendet',
    errorTitle: 'Ausführungsfehler',
    stderrTitle: 'stderr',
    tabBody: 'Inhalt',
    tabHeaders: 'Header',
    tabRaw: 'Roh',
    actionCopy: 'Kopieren',
    actionDownload: 'Herunterladen',
    emptyBody: '(leerer Inhalt)',
    emptyHeaders: '(keine Header)',
  },

  consent: {
    title: 'Verlauf speichern erlauben?',
    message:
      'Wir verwenden Browser-Cookies / lokalen Speicher, um deinen cURL-Verlauf zu speichern. Daten bleiben auf deinem Gerät und werden nie an einen Server gesendet.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
  },

  history: {
    title: 'Verlauf',
    empty: 'Noch kein Verlauf',
    noMatch: 'Keine passenden Einträge',
    searchPlaceholder: 'Befehl oder URL suchen...',
    clear: 'Alle löschen',
    confirmClear: 'Gesamten Verlauf löschen?',
    cleared: 'Verlauf gelöscht',
    remove: 'Entfernen',
    untitled: '(keine URL)',
    disabledTitle: 'Verlauf deaktiviert',
    disabledMsg: 'Akzeptiere lokalen Speicher, um deinen Verlauf zu speichern und anzusehen.',
    enabled: 'Verlauf aktiviert',
  },

  theme: {
    title: 'Thema',
    light: 'Hell',
    dark: 'Dunkel',
    auto: 'System',
  },

  engine: {
    title: 'Engine',
    browser: 'Browser',
    browserHint: 'Direkter fetch · ohne Server · CORS-eingeschränkt',
    server: 'Lokaler Proxy',
    serverHint: 'Lokales curl aufrufen · volle Unterstützung · Server erforderlich',
    corsHint:
      'Anfrage fehlgeschlagen, wahrscheinlich durch die CORS-Richtlinie des Zielservers blockiert. Wechsle zum „Lokalen Proxy", um die Anfrage über dein lokales curl zu senden und Browser-Einschränkungen zu umgehen.',
    retryWithServer: 'Mit lokalem Proxy erneut versuchen',
    unsupportedTitle: 'Einige Flags werden im Browser nicht unterstützt',
  },
};

export default messages;
