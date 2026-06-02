import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Lokální spuštění · Formátování · Vizualizace',
    docsLink: 'dokumentace curl',
    language: 'Jazyk',
  },

  meta: {
    description:
      'Spouštějte, formátujte a vizualizujte curl příkazy lokálně v prohlížeči. Stromový / myšlenkový pohled na JSON, 20 jazyků, tmavý režim a desktopová aplikace bez omezení CORS.',
    keywords:
      'curl, curl nástroj, curl online, JSON formátovač, JSON strom, JSON myšlenková mapa, HTTP klient, testování API, postman alternativa, REST klient',
  },

  editor: {
    run: 'Spustit',
    running: 'Probíhá',
    format: 'Formátovat',
    minify: 'Minimalizovat',
    copy: 'Kopírovat',
    clear: 'Vymazat',
    placeholder:
      'Vložte nebo napište příkaz curl...\n\nPříklad:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: 'řádků: {n}',
    statusChars: 'znaků: {n}',
    statusHint: 'Tab = 2 mezery · {run} spustit · {format} formátovat',
  },

  messages: {
    emptyCommand: 'Zadejte příkaz curl',
    formatted: 'Naformátováno',
    formatFailed: 'Formátování selhalo: {msg}',
    minifyFailed: 'Minimalizace selhala: {msg}',
    copied: 'Zkopírováno do schránky',
    copyBodyOk: 'Tělo odpovědi zkopírováno',
    copyFailed: 'Kopírování selhalo, zkopírujte ručně',
    requestFailed: 'Požadavek selhal: {msg}',
  },

  result: {
    emptyTitle: 'Zatím žádný výsledek',
    emptyHint: 'Upravte příkaz curl vlevo, pak klikněte na «Spustit» nebo stiskněte {hotkey}',
    running: 'Probíhá...',
    metaTime: 'Čas',
    metaSize: 'Velikost',
    metaType: 'Typ',
    metaExit: 'Návrat',
    errorTitle: 'Chyba spuštění',
    stderrTitle: 'stderr',
    tabBody: 'Tělo',
    tabHeaders: 'Hlavičky',
    tabRaw: 'Surová data',
    actionCopy: 'Kopírovat',
    actionDownload: 'Stáhnout',
    emptyBody: '(prázdné tělo)',
    emptyHeaders: '(žádné hlavičky)',
    formatLabel: 'Formát',
    formatText: 'Text',
    formatTree: 'Strom',
    formatMind: 'Myšlenková mapa',
    searchPlaceholder: 'Hledat v JSON…',
    searchEmpty: 'Žádné shody',
    searchPrev: 'Předchozí shoda',
    searchNext: 'Další shoda',
  },

  consent: {
    title: 'Povolit ukládání historie?',
    message:
      'Pro ukládání historie spouštění cURL používáme cookies / místní úložiště prohlížeče. Data zůstávají na vašem zařízení a nikdy se neodesílají na žádný server.',
    accept: 'Souhlasím',
    decline: 'Odmítnout',
  },

  history: {
    title: 'Historie',
    empty: 'Zatím žádná historie',
    noMatch: 'Žádné odpovídající záznamy',
    searchPlaceholder: 'Hledat příkaz nebo URL...',
    clear: 'Vymazat vše',
    confirmClear: 'Vymazat celou historii?',
    cleared: 'Historie vymazána',
    remove: 'Odstranit',
    untitled: '(bez URL)',
    disabledTitle: 'Historie je vypnutá',
    disabledMsg: 'Povolte místní úložiště pro ukládání a prohlížení historie.',
    enabled: 'Historie zapnuta',
    favorite: 'Přidat do oblíbených',
    unfavorite: 'Odebrat z oblíbených',
    confirmClearKeepFav:
      'Vymazat veškerou historii kromě oblíbených? {count} oblíbených bude zachováno.',
  },

  theme: {
    title: 'Motiv',
    light: 'Světlý',
    dark: 'Tmavý',
    auto: 'Systémový',
  },

  engine: {
    title: 'Engine',
    browser: 'Prohlížeč',
    browserHint: 'Přímé fetch · bez serveru · omezeno CORS',
    server: 'Lokální proxy',
    serverHint: 'Volá lokální curl · plná podpora · vyžaduje server',
    corsHint:
      'Požadavek selhal, pravděpodobně blokován politikou CORS cílového serveru. Přepněte na «Lokální proxy», abyste požadavek odeslali přes lokální curl a obešli omezení prohlížeče.',
    retryWithServer: 'Zkusit znovu přes lokální proxy',
    unsupportedTitle: 'Některé příznaky nejsou v prohlížeči podporovány',
    desktop: 'Desktop',
    desktopHint: 'Běží v desktopové aplikaci · přímo volá systémový curl',
    downloadDesktop: 'Stáhnout desktopovou aplikaci',
    desktopAppHint:
      'Desktopová aplikace přímo volá systémový curl — žádná omezení CORS, hlaviček ani TLS, žádný server není potřeba.',
  },

  share: {
    button: 'Sdílet',
    title: 'Sdílet odkaz na stažení',
    subtitle: 'Pošlete odkaz na desktopovou aplikaci přátelům nebo na svůj telefon',
    copy: 'Kopírovat odkaz',
    copied: 'Odkaz zkopírován do schránky',
    qrHint: 'Naskenujte pro stažení na mobilu',
    openLink: 'Otevřít stránku stažení',
    nativeShare: 'Sdílet přes…',
  },
};

export default messages;
