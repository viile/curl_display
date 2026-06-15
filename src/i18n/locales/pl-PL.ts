import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Uruchamianie lokalnie · Formatowanie · Wizualizacja',
    docsLink: 'dokumentacja curl',
    language: 'Język',
  },

  meta: {
    description:
      'Uruchamiaj, formatuj i wizualizuj polecenia curl lokalnie w przeglądarce. Widok drzewa / mapy myśli JSON, 20 języków, ciemny motyw i aplikacja desktopowa bez ograniczeń CORS.',
    keywords:
      'curl, narzędzie curl, curl online, formatter JSON, drzewo JSON, mapa myśli JSON, klient HTTP, testowanie API, alternatywa postman, klient REST',
  },

  editor: {
    run: 'Uruchom',
    running: 'Uruchamianie',
    stop: 'Zatrzymaj',
    format: 'Sformatuj',
    minify: 'Minimalizuj',
    decode: 'Dekoduj',
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
    requestAborted: 'Żądanie zatrzymane',
  },

  result: {
    emptyTitle: 'Brak wyników',
    emptyHint: 'Edytuj polecenie curl po lewej, a następnie kliknij «Uruchom» lub naciśnij {hotkey}',
    running: 'Uruchamianie...',
    runningHint: 'Kliknij «Zatrzymaj» lub naciśnij Esc, aby przerwać żądanie',
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
    formatLabel: 'Format',
    formatText: 'Tekst',
    formatTree: 'Drzewo',
    formatMind: 'Mapa myśli',
    searchPlaceholder: 'Szukaj w JSON…',
    searchEmpty: 'Brak dopasowań',
    searchPrev: 'Poprzednie dopasowanie',
    searchNext: 'Następne dopasowanie',
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
    favorite: 'Dodaj do ulubionych',
    unfavorite: 'Usuń z ulubionych',
    confirmClearKeepFav:
      'Wyczyścić całą historię oprócz ulubionych? {count} ulubionych zostanie zachowanych.',
  },

  favorites: {
    title: 'Ulubione',
    empty: 'Brak ulubionych — kliknij ☆ przy elemencie historii, aby dodać',
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

  share: {
    button: 'Udostępnij',
    title: 'Udostępnij link do pobrania',
    subtitle: 'Wyślij link do aplikacji desktopowej znajomym lub na swój telefon',
    copy: 'Kopiuj link',
    copied: 'Link skopiowany do schowka',
    qrHint: 'Zeskanuj, aby pobrać na telefon',
    openLink: 'Otwórz stronę pobierania',
    nativeShare: 'Udostępnij przez…',
  },
  decode: {
    title: 'Dekoder curl',
    empty: 'Brak parametrów do dekodowania w tym poleceniu',
    sectionQuery: 'Parametry zapytania URL',
    sectionHeaders: 'Nagłówki',
    sectionCookies: 'Ciasteczka',
    sectionForm: 'Pola formularza (-F)',
    sectionData: 'Treść żądania',
    colKey: 'Klucz',
    colValue: 'Wartość',
    colRaw: 'Surowy',
    colDecoded: 'Zdekodowany',
    colHeaderName: 'Nazwa',
    colHeaderValue: 'Wartość',
    copyUrl: 'Kopiuj URL',
    copyRaw: 'Kopiuj surowy',
    copyAll: 'Kopiuj wszystko',
    copied: 'Skopiowano',
    close: 'Zamknij',
    parseErrorTitle: 'Błąd parsowania',
    warningsTitle: 'Ostrzeżenia',
    kindText: 'Tekst',
  },

};

export default messages;
