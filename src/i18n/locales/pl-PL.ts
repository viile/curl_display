import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Uruchamianie lokalnie · Formatowanie · Wizualizacja',
    docsLink: 'dokumentacja curl',
    language: 'Język',
  },

  editor: {
    run: 'Uruchom',
    running: 'Uruchamianie',
    format: 'Sformatuj',
    minify: 'Minimalizuj',
    copy: 'Kopiuj',
    clear: 'Wyczyść',
    placeholder:
      'Wklej lub wpisz polecenie curl...\n\nPrzykład:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: 'wiersze: {n}',
    statusChars: 'znaki: {n}',
    statusHint: 'Tab = 2 spacje · {run} uruchom · {format} sformatuj',
  },

  messages: {
    emptyCommand: 'Wpisz polecenie curl',
    formatted: 'Sformatowano',
    formatFailed: 'Formatowanie nie powiodło się: {msg}',
    minifyFailed: 'Minimalizacja nie powiodła się: {msg}',
    copied: 'Skopiowano do schowka',
    copyBodyOk: 'Treść odpowiedzi skopiowana',
    copyFailed: 'Nie udało się skopiować, skopiuj ręcznie',
    requestFailed: 'Żądanie nie powiodło się: {msg}',
  },

  result: {
    emptyTitle: 'Brak wyników',
    emptyHint: 'Edytuj polecenie curl po lewej, a następnie kliknij «Uruchom» lub naciśnij {hotkey}',
    running: 'Uruchamianie...',
    metaTime: 'Czas',
    metaSize: 'Rozmiar',
    metaType: 'Typ',
    metaExit: 'Wyjście',
    errorTitle: 'Błąd wykonania',
    stderrTitle: 'stderr',
    tabBody: 'Treść',
    tabHeaders: 'Nagłówki',
    tabRaw: 'Surowe',
    actionCopy: 'Kopiuj',
    actionDownload: 'Pobierz',
    emptyBody: '(pusta treść)',
    emptyHeaders: '(brak nagłówków)',
  },

  consent: {
    title: 'Zezwolić na zapis historii?',
    message:
      'Używamy plików cookie / pamięci lokalnej przeglądarki, aby zapisywać historię wykonań cURL. Dane pozostają na Twoim urządzeniu i nie są wysyłane na żadne serwery.',
    accept: 'Akceptuj',
    decline: 'Odrzuć',
  },

  history: {
    title: 'Historia',
    empty: 'Brak historii',
    noMatch: 'Brak dopasowań',
    searchPlaceholder: 'Szukaj polecenia lub URL...',
    clear: 'Wyczyść wszystko',
    confirmClear: 'Wyczyścić całą historię?',
    cleared: 'Historia wyczyszczona',
    remove: 'Usuń',
    untitled: '(brak URL)',
    disabledTitle: 'Historia wyłączona',
    disabledMsg: 'Zaakceptuj pamięć lokalną, aby zapisywać i przeglądać historię.',
    enabled: 'Historia włączona',
  },

  theme: {
    title: 'Motyw',
    light: 'Jasny',
    dark: 'Ciemny',
    auto: 'Systemowy',
  },

  engine: {
    title: 'Silnik',
    browser: 'Przeglądarka',
    browserHint: 'Bezpośrednie fetch · bez serwera · ograniczone CORS',
    server: 'Lokalny proxy',
    serverHint: 'Wywołuje lokalny curl · pełna obsługa · wymaga serwera',
    corsHint:
      'Żądanie nie powiodło się, prawdopodobnie zablokowane przez politykę CORS serwera docelowego. Przełącz na «Lokalny proxy», aby wysłać żądanie przez lokalny curl i ominąć ograniczenia przeglądarki.',
    retryWithServer: 'Spróbuj ponownie przez lokalny proxy',
    unsupportedTitle: 'Niektóre flagi nie są obsługiwane w przeglądarce',
    desktop: 'Aplikacja desktopowa',
    desktopHint: 'Działa w aplikacji desktopowej · bezpośrednio wywołuje curl systemowy',
    downloadDesktop: 'Pobierz aplikację desktopową',
    desktopAppHint:
      'Aplikacja desktopowa bezpośrednio wywołuje systemowy curl — bez ograniczeń CORS, nagłówków czy TLS, bez potrzeby serwera.',
  },
};

export default messages;
