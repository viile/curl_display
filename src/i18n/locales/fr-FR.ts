import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Exécution locale · Formater · Visualiser',
    docsLink: 'docs curl',
    language: 'Langue',
  },

  meta: {
    description:
      'Exécutez, formatez et visualisez des commandes curl localement dans votre navigateur. Vues arbre / carte mentale JSON, 20 langues, mode sombre, version bureau sans limite CORS.',
    keywords:
      'curl, outil curl, curl en ligne, formateur JSON, arbre JSON, carte mentale JSON, client HTTP, test API, alternative postman, client REST',
  },

  editor: {
    run: 'Exécuter',
    running: 'Exécution',
    stop: 'Arrêter',
    format: 'Formater',
    minify: 'Réduire',
    decode: 'Décoder',
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
    requestAborted: 'Requête arrêtée',
  },

  result: {
    emptyTitle: 'Pas encore de résultat',
    emptyHint: 'Modifiez une commande curl à gauche, puis cliquez sur « Exécuter » ou appuyez sur {hotkey}',
    running: 'Exécution en cours...',
    runningHint: 'Cliquez sur « Arrêter » ou appuyez sur Esc pour annuler la requête',
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
    formatLabel: 'Format',
    formatText: 'Texte',
    formatTree: 'Arbre',
    formatMind: 'Carte mentale',
    searchPlaceholder: 'Rechercher dans le JSON…',
    searchEmpty: 'Aucun résultat',
    searchPrev: 'Résultat précédent',
    searchNext: 'Résultat suivant',
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
    favorite: 'Ajouter aux favoris',
    unfavorite: 'Retirer des favoris',
    confirmClearKeepFav:
      "Effacer tout l'historique non favori ? {count} favori(s) seront conservés.",
  },

  favorites: {
    title: 'Favoris',
    empty: 'Aucun favori pour le moment — appuyez sur ☆ d’un élément de l’historique pour l’ajouter',
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

  share: {
    button: 'Partager',
    title: 'Partager le lien de téléchargement',
    subtitle: "Envoyez le lien de l'app desktop à vos amis ou à votre mobile",
    copy: 'Copier le lien',
    copied: 'Lien copié dans le presse-papiers',
    qrHint: 'Scanner pour télécharger sur mobile',
    openLink: 'Ouvrir la page de téléchargement',
    nativeShare: 'Partager via…',
  },
  decode: {
    title: 'Décodeur curl',
    empty: 'Aucun paramètre décodable dans cette commande',
    sectionQuery: 'Paramètres de requête URL',
    sectionHeaders: 'En-têtes',
    sectionCookies: 'Cookies',
    sectionForm: 'Champs de formulaire (-F)',
    sectionData: 'Corps de la requête',
    colKey: 'Clé',
    colValue: 'Valeur',
    colRaw: 'Brut',
    colDecoded: 'Décodé',
    colHeaderName: 'Nom',
    colHeaderValue: 'Valeur',
    copyUrl: 'Copier l\'URL',
    copyRaw: 'Copier le brut',
    copyAll: 'Tout copier',
    copied: 'Copié',
    close: 'Fermer',
    parseErrorTitle: 'Échec de l\'analyse',
    warningsTitle: 'Avertissements',
    kindText: 'Texte',
  },

};

export default messages;
