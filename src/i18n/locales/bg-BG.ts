import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Локално изпълнение · Форматиране · Визуализация',
    docsLink: 'curl документация',
    language: 'Език',
  },

  meta: {
    description:
      'Изпълнявайте, форматирайте и визуализирайте curl команди локално в браузъра. Дървовидно / мисловно представяне на JSON, 20 езика, тъмна тема и десктоп приложение без ограничения от CORS.',
    keywords:
      'curl, curl инструмент, curl онлайн, JSON форматер, JSON дърво, JSON мисловна карта, HTTP клиент, тестване на API, postman алтернатива, REST клиент',
  },

  editor: {
    run: 'Изпълни',
    running: 'Изпълнение',
    format: 'Форматирай',
    minify: 'Свий',
    decode: 'Декодиране',
    copy: 'Копирай',
    clear: 'Изчисти',
    placeholder:
      'Поставете или въведете curl команда...\n\nПример:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} реда',
    statusChars: '{n} символа',
    statusHint: 'Tab = 2 интервала · {run} изпълни · {format} форматирай',
  },

  messages: {
    emptyCommand: 'Моля, въведете curl команда',
    formatted: 'Форматирано',
    formatFailed: 'Грешка при форматиране: {msg}',
    minifyFailed: 'Грешка при свиване: {msg}',
    copied: 'Копирано в клипборда',
    copyBodyOk: 'Тялото на отговора е копирано',
    copyFailed: 'Копирането не успя, копирайте ръчно',
    requestFailed: 'Заявката не успя: {msg}',
  },

  result: {
    emptyTitle: 'Все още няма резултат',
    emptyHint: 'Редактирайте curl командата отляво, после натиснете «Изпълни» или {hotkey}',
    running: 'Изпълнение...',
    metaTime: 'Време',
    metaSize: 'Размер',
    metaType: 'Тип',
    metaExit: 'Изход',
    errorTitle: 'Грешка при изпълнение',
    stderrTitle: 'stderr',
    tabBody: 'Тяло',
    tabHeaders: 'Заглавки',
    tabRaw: 'Сурово',
    actionCopy: 'Копирай',
    actionDownload: 'Изтегли',
    emptyBody: '(празно тяло)',
    emptyHeaders: '(няма заглавки)',
    formatLabel: 'Формат',
    formatText: 'Текст',
    formatTree: 'Дърво',
    formatMind: 'Мисловна карта',
    searchPlaceholder: 'Търсене в JSON…',
    searchEmpty: 'Няма съвпадения',
    searchPrev: 'Предишно съвпадение',
    searchNext: 'Следващо съвпадение',
  },

  consent: {
    title: 'Разрешавате ли запазване на историята?',
    message:
      'Използваме бисквитки / локално хранилище на браузъра, за да съхраняваме историята на изпълненията на cURL. Данните остават на вашето устройство и никога не се изпращат към сървър.',
    accept: 'Приемам',
    decline: 'Отказвам',
  },

  history: {
    title: 'История',
    empty: 'Все още няма история',
    noMatch: 'Няма съвпадения',
    searchPlaceholder: 'Търсене на команда или URL...',
    clear: 'Изчисти всичко',
    confirmClear: 'Изчистване на цялата история?',
    cleared: 'Историята е изчистена',
    remove: 'Премахни',
    untitled: '(без URL)',
    disabledTitle: 'Историята е изключена',
    disabledMsg: 'Приемете локалното хранилище, за да запазвате и преглеждате историята.',
    enabled: 'Историята е активирана',
    favorite: 'Добави в любими',
    unfavorite: 'Премахни от любими',
    confirmClearKeepFav:
      'Изчистване на цялата нелюбима история? {count} любими записа ще бъдат запазени.',
  },

  theme: {
    title: 'Тема',
    light: 'Светла',
    dark: 'Тъмна',
    auto: 'Системна',
  },

  engine: {
    title: 'Двигател',
    browser: 'Браузър',
    browserHint: 'Директен fetch · без сървър · ограничено от CORS',
    server: 'Локален прокси',
    serverHint: 'Извиква локалния curl · пълна поддръжка · нужен е сървър',
    corsHint:
      'Заявката не успя, вероятно блокирана от CORS политиката на целевия сървър. Превключете на «Локален прокси», за да изпратите заявката чрез локалния curl и да заобиколите ограниченията на браузъра.',
    retryWithServer: 'Опитай отново чрез локален прокси',
    unsupportedTitle: 'Някои параметри не се поддържат в браузъра',
    desktop: 'Десктоп',
    desktopHint: 'Работи в десктоп приложение · директно извиква системния curl',
    downloadDesktop: 'Изтегли десктоп приложение',
    desktopAppHint:
      'Десктоп приложението директно извиква системния curl — без CORS, header или TLS ограничения, без сървър.',
  },

  share: {
    button: 'Сподели',
    title: 'Споделяне на връзка за изтегляне',
    subtitle: 'Изпрати връзката към приложението за десктоп на приятели или на телефона си',
    copy: 'Копирай връзката',
    copied: 'Връзката е копирана в клипборда',
    qrHint: 'Сканирай, за да изтеглиш на мобилно устройство',
    openLink: 'Отвори страницата за изтегляне',
    nativeShare: 'Сподели чрез…',
  },
  decode: {
    title: 'curl декодер',
    empty: 'В тази команда няма параметри за декодиране',
    sectionQuery: 'URL заявка параметри',
    sectionHeaders: 'Заглавки',
    sectionCookies: 'Бисквитки',
    sectionForm: 'Полета на формуляр (-F)',
    sectionData: 'Тяло на заявката',
    colKey: 'Ключ',
    colValue: 'Стойност',
    colRaw: 'Оригинал',
    colDecoded: 'Декодирано',
    colHeaderName: 'Име',
    colHeaderValue: 'Стойност',
    copyUrl: 'Копирай URL',
    copyRaw: 'Копирай оригинал',
    copyAll: 'Копирай всичко',
    copied: 'Копирано',
    close: 'Затвори',
    parseErrorTitle: 'Грешка при анализ',
    warningsTitle: 'Предупреждения',
    kindText: 'Текст',
  },

};

export default messages;
