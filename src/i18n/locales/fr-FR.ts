import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Exécution locale · Formater · Visualiser',
    docsLink: 'docs curl',
    language: 'Langue',
  },

  editor: {
    run: 'Exécuter',
    running: 'Exécution',
    format: 'Formater',
    minify: 'Réduire',
    copy: 'Copier',
    clear: 'Effacer',
    placeholder:
      'Collez ou tapez une commande curl ici...\n\nExemple :\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} lignes',
    statusChars: '{n} caractères',
    statusHint: 'Tab = 2 espaces · {run} exécuter · {format} formater',
  },

  messages: {
    emptyCommand: 'Veuillez saisir une commande curl',
    formatted: 'Formaté',
    formatFailed: 'Échec du formatage : {msg}',
    minifyFailed: 'Échec de la réduction : {msg}',
    copied: 'Copié dans le presse-papiers',
    copyBodyOk: 'Corps de la réponse copié',
    copyFailed: 'Échec de la copie, copiez manuellement',
    requestFailed: 'Échec de la requête : {msg}',
  },

  result: {
    emptyTitle: 'Pas encore de résultat',
    emptyHint: 'Modifiez une commande curl à gauche, puis cliquez sur « Exécuter » ou appuyez sur {hotkey}',
    running: 'Exécution en cours...',
    metaTime: 'Temps',
    metaSize: 'Taille',
    metaType: 'Type',
    metaExit: 'Sortie',
    errorTitle: 'Erreur d\'exécution',
    stderrTitle: 'stderr',
    tabBody: 'Corps',
    tabHeaders: 'En-têtes',
    tabRaw: 'Brut',
    actionCopy: 'Copier',
    actionDownload: 'Télécharger',
    emptyBody: '(corps vide)',
    emptyHeaders: '(aucun en-tête)',
  },

  consent: {
    title: 'Autoriser l\'enregistrement de l\'historique ?',
    message:
      'Nous utilisons les cookies / le stockage local du navigateur pour sauvegarder votre historique d\'exécution cURL. Les données restent sur votre appareil et ne sont jamais envoyées à un serveur.',
    accept: 'Accepter',
    decline: 'Refuser',
  },

  history: {
    title: 'Historique',
    empty: 'Aucun historique pour le moment',
    noMatch: 'Aucune entrée correspondante',
    searchPlaceholder: 'Rechercher une commande ou URL...',
    clear: 'Tout effacer',
    confirmClear: 'Effacer tout l\'historique ?',
    cleared: 'Historique effacé',
    remove: 'Supprimer',
    untitled: '(aucune URL)',
    disabledTitle: 'Historique désactivé',
    disabledMsg: 'Acceptez le stockage local pour sauvegarder et consulter l\'historique.',
    enabled: 'Historique activé',
  },

  theme: {
    title: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    auto: 'Système',
  },

  engine: {
    title: 'Moteur',
    browser: 'Navigateur',
    browserHint: 'fetch direct · sans serveur · limité par CORS',
    server: 'Proxy local',
    serverHint: 'Lance curl local · support complet · serveur requis',
    corsHint:
      "Échec de la requête, probablement bloquée par la politique CORS du serveur cible. Basculez sur « Proxy local » pour envoyer la requête via votre curl local et contourner les restrictions du navigateur.",
    retryWithServer: 'Réessayer via le proxy local',
    unsupportedTitle: 'Certaines options ne sont pas prises en charge dans le navigateur',
    desktop: 'Application bureau',
    desktopHint: "Exécuté dans l'application bureau · appel direct au curl système",
    downloadDesktop: "Télécharger l'application bureau",
    desktopAppHint:
      "L'application bureau invoque directement le curl système — aucune restriction CORS, en-têtes ou TLS, aucun serveur requis.",
  },
};

export default messages;
