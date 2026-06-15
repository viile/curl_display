import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Ejecutar localmente · Formatear · Visualizar',
    docsLink: 'docs de curl',
    language: 'Idioma',
  },

  meta: {
    description:
      'Ejecuta, formatea y visualiza comandos curl localmente en tu navegador. Vistas de árbol / mapa mental JSON, 20 idiomas, modo oscuro y app de escritorio sin límites CORS.',
    keywords:
      'curl, herramienta curl, curl online, formateador JSON, árbol JSON, mapa mental JSON, cliente HTTP, prueba de API, alternativa postman, cliente REST',
  },

  editor: {
    run: 'Ejecutar',
    running: 'Ejecutando',
    stop: 'Detener',
    format: 'Formatear',
    minify: 'Minimizar',
    decode: 'Decodificar',
    copy: 'Copiar',
    clear: 'Limpiar',
    placeholder:
      'Pega o escribe un comando curl aquí...\n\nEjemplo:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} líneas',
    statusChars: '{n} caracteres',
    statusHint: 'Tab = 2 espacios · {run} ejecutar · {format} formatear',
  },

  messages: {
    emptyCommand: 'Introduce un comando curl',
    formatted: 'Formateado',
    formatFailed: 'Error al formatear: {msg}',
    minifyFailed: 'Error al minimizar: {msg}',
    copied: 'Copiado al portapapeles',
    copyBodyOk: 'Cuerpo de la respuesta copiado',
    copyFailed: 'Error al copiar, copia manualmente',
    requestFailed: 'Error en la solicitud: {msg}',
    requestAborted: 'Solicitud detenida',
  },

  result: {
    emptyTitle: 'Aún no hay resultado',
    emptyHint: 'Edita un comando curl a la izquierda, luego haz clic en «Ejecutar» o pulsa {hotkey}',
    running: 'Ejecutando...',
    runningHint: 'Haz clic en «Detener» o pulsa Esc para abortar la solicitud',
    metaTime: 'Tiempo',
    metaSize: 'Tamaño',
    metaType: 'Tipo',
    metaExit: 'Salida',
    errorTitle: 'Error de ejecución',
    stderrTitle: 'stderr',
    tabBody: 'Cuerpo',
    tabHeaders: 'Cabeceras',
    tabRaw: 'Crudo',
    actionCopy: 'Copiar',
    actionDownload: 'Descargar',
    emptyBody: '(cuerpo vacío)',
    emptyHeaders: '(sin cabeceras)',
    formatLabel: 'Formato',
    formatText: 'Texto',
    formatTree: 'Árbol',
    formatMind: 'Mapa mental',
    searchPlaceholder: 'Buscar en el JSON…',
    searchEmpty: 'Sin coincidencias',
    searchPrev: 'Coincidencia anterior',
    searchNext: 'Coincidencia siguiente',
  },

  consent: {
    title: '¿Permitir guardar el historial?',
    message:
      'Usamos cookies del navegador / almacenamiento local para guardar tu historial de ejecución cURL. Los datos permanecen en tu dispositivo y nunca se envían a ningún servidor.',
    accept: 'Aceptar',
    decline: 'Rechazar',
  },

  history: {
    title: 'Historial',
    empty: 'Aún no hay historial',
    noMatch: 'Sin coincidencias',
    searchPlaceholder: 'Buscar comando o URL...',
    clear: 'Borrar todo',
    confirmClear: '¿Borrar todo el historial?',
    cleared: 'Historial borrado',
    remove: 'Eliminar',
    untitled: '(sin URL)',
    disabledTitle: 'Historial deshabilitado',
    disabledMsg: 'Acepta el almacenamiento local para guardar y ver tu historial.',
    enabled: 'Historial habilitado',
    favorite: 'Añadir a favoritos',
    unfavorite: 'Quitar de favoritos',
    confirmClearKeepFav:
      '¿Borrar todo el historial no favorito? Se conservarán {count} favoritos.',
  },

  favorites: {
    title: 'Favoritos',
    empty: 'Aún no hay favoritos — toca ☆ en un elemento del historial para añadir',
  },

  theme: {
    title: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    auto: 'Sistema',
  },

  engine: {
    title: 'Motor',
    browser: 'Navegador',
    browserHint: 'fetch directo · sin servidor · limitado por CORS',
    server: 'Proxy local',
    serverHint: 'Invoca curl local · soporte completo · requiere servidor',
    corsHint:
      'Solicitud fallida, probablemente bloqueada por la política CORS del servidor de destino. Cambia a «Proxy local» para enviar la solicitud a través de tu curl local y evitar las restricciones del navegador.',
    retryWithServer: 'Reintentar vía proxy local',
    unsupportedTitle: 'Algunas opciones no son compatibles con el navegador',
    desktop: 'Escritorio',
    desktopHint: 'Ejecutándose en la app de escritorio · invoca curl del sistema directamente',
    downloadDesktop: 'Descargar app de escritorio',
    desktopAppHint:
      'La app de escritorio invoca directamente tu curl del sistema — sin restricciones de CORS, encabezados ni TLS, sin necesidad de servidor.',
  },

  share: {
    button: 'Compartir',
    title: 'Compartir enlace de descarga',
    subtitle: 'Envía el enlace de la app de escritorio a tus amigos o a tu móvil',
    copy: 'Copiar enlace',
    copied: 'Enlace copiado al portapapeles',
    qrHint: 'Escanea para descargar en el móvil',
    openLink: 'Abrir página de descarga',
    nativeShare: 'Compartir mediante…',
  },
  decode: {
    title: 'Decodificador curl',
    empty: 'No hay parámetros decodificables en este comando',
    sectionQuery: 'Parámetros de consulta URL',
    sectionHeaders: 'Cabeceras',
    sectionCookies: 'Cookies',
    sectionForm: 'Campos de formulario (-F)',
    sectionData: 'Cuerpo de la solicitud',
    colKey: 'Clave',
    colValue: 'Valor',
    colRaw: 'Original',
    colDecoded: 'Decodificado',
    colHeaderName: 'Nombre',
    colHeaderValue: 'Valor',
    copyUrl: 'Copiar URL',
    copyRaw: 'Copiar original',
    copyAll: 'Copiar todo',
    copied: 'Copiado',
    close: 'Cerrar',
    parseErrorTitle: 'Error de análisis',
    warningsTitle: 'Advertencias',
    kindText: 'Texto',
  },

};

export default messages;
