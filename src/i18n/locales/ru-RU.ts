import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Локальное выполнение · Форматирование · Визуализация',
    docsLink: 'документация curl',
    language: 'Язык',
  },

  meta: {
    description:
      'Запускайте, форматируйте и визуализируйте curl-команды локально в браузере. Дерево / интеллект-карта JSON, 20 языков, тёмная тема, десктоп-приложение без ограничений CORS.',
    keywords:
      'curl, curl онлайн, инструмент curl, JSON форматтер, JSON дерево, JSON интеллект-карта, HTTP клиент, тестирование API, postman альтернатива, REST клиент',
  },

  editor: {
    run: 'Выполнить',
    running: 'Выполняется',
    format: 'Форматировать',
    minify: 'Сжать',
    copy: 'Копировать',
    clear: 'Очистить',
    placeholder:
      'Вставьте или введите команду curl...\n\nПример:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: 'строк: {n}',
    statusChars: 'символов: {n}',
    statusHint: 'Tab = 2 пробела · {run} выполнить · {format} форматировать',
  },

  messages: {
    emptyCommand: 'Введите команду curl',
    formatted: 'Отформатировано',
    formatFailed: 'Ошибка форматирования: {msg}',
    minifyFailed: 'Ошибка сжатия: {msg}',
    copied: 'Скопировано в буфер обмена',
    copyBodyOk: 'Тело ответа скопировано',
    copyFailed: 'Не удалось скопировать, скопируйте вручную',
    requestFailed: 'Ошибка запроса: {msg}',
  },

  result: {
    emptyTitle: 'Пока нет результата',
    emptyHint: 'Отредактируйте команду curl слева, затем нажмите «Выполнить» или {hotkey}',
    running: 'Выполняется...',
    metaTime: 'Время',
    metaSize: 'Размер',
    metaType: 'Тип',
    metaExit: 'Код выхода',
    errorTitle: 'Ошибка выполнения',
    stderrTitle: 'stderr',
    tabBody: 'Тело',
    tabHeaders: 'Заголовки',
    tabRaw: 'Сырые данные',
    actionCopy: 'Копировать',
    actionDownload: 'Скачать',
    emptyBody: '(пустое тело)',
    emptyHeaders: '(нет заголовков)',
    formatLabel: 'Формат',
    formatText: 'Текст',
    formatTree: 'Дерево',
    formatMind: 'Интеллект-карта',
    searchPlaceholder: 'Поиск по JSON…',
    searchEmpty: 'Совпадений нет',
    searchPrev: 'Предыдущее совпадение',
    searchNext: 'Следующее совпадение',
  },

  consent: {
    title: 'Разрешить сохранение истории?',
    message:
      'Мы используем файлы cookie / локальное хранилище для сохранения вашей истории выполнения cURL. Данные остаются на вашем устройстве и никогда не отправляются на сервер.',
    accept: 'Принять',
    decline: 'Отклонить',
  },

  history: {
    title: 'История',
    empty: 'История пуста',
    noMatch: 'Нет совпадений',
    searchPlaceholder: 'Поиск команды или URL...',
    clear: 'Очистить все',
    confirmClear: 'Очистить всю историю?',
    cleared: 'История очищена',
    remove: 'Удалить',
    untitled: '(нет URL)',
    disabledTitle: 'История отключена',
    disabledMsg: 'Разрешите локальное хранилище, чтобы сохранять и просматривать историю.',
    enabled: 'История включена',
    favorite: 'Добавить в избранное',
    unfavorite: 'Убрать из избранного',
    confirmClearKeepFav:
      'Очистить всю историю кроме избранного? {count} избранных запис(и) будут сохранены.',
  },

  theme: {
    title: 'Тема',
    light: 'Светлая',
    dark: 'Тёмная',
    auto: 'Системная',
  },

  engine: {
    title: 'Движок',
    browser: 'Браузер',
    browserHint: 'Прямой fetch · без сервера · ограничения CORS',
    server: 'Локальный прокси',
    serverHint: 'Запускает локальный curl · полная поддержка · требуется сервер',
    corsHint:
      'Запрос не удался, скорее всего заблокирован политикой CORS целевого сервера. Переключитесь на «Локальный прокси», чтобы отправить запрос через локальный curl и обойти ограничения браузера.',
    retryWithServer: 'Повторить через локальный прокси',
    unsupportedTitle: 'Некоторые флаги не поддерживаются в браузере',
    desktop: 'Десктоп',
    desktopHint: 'Запущено в десктоп-приложении · прямой вызов системного curl',
    downloadDesktop: 'Скачать десктоп-приложение',
    desktopAppHint:
      'Десктоп-приложение напрямую вызывает системный curl — без ограничений CORS, заголовков или TLS, без необходимости в сервере.',
  },

  share: {
    button: 'Поделиться',
    title: 'Поделиться ссылкой на загрузку',
    subtitle: 'Отправьте ссылку на десктоп-приложение друзьям или себе на телефон',
    copy: 'Скопировать ссылку',
    copied: 'Ссылка скопирована в буфер обмена',
    qrHint: 'Отсканируйте для загрузки на мобильном',
    openLink: 'Открыть страницу загрузки',
    nativeShare: 'Поделиться через…',
  },
};

export default messages;
