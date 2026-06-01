import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Executar localmente · Formatar · Visualizar',
    docsLink: 'docs do curl',
    language: 'Idioma',
  },

  editor: {
    run: 'Executar',
    running: 'Executando',
    format: 'Formatar',
    minify: 'Minificar',
    copy: 'Copiar',
    clear: 'Limpar',
    placeholder:
      'Cole ou digite um comando curl aqui...\n\nExemplo:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} linhas',
    statusChars: '{n} caracteres',
    statusHint: 'Tab = 2 espaços · {run} executar · {format} formatar',
  },

  messages: {
    emptyCommand: 'Insira um comando curl',
    formatted: 'Formatado',
    formatFailed: 'Falha ao formatar: {msg}',
    minifyFailed: 'Falha ao minificar: {msg}',
    copied: 'Copiado para a área de transferência',
    copyBodyOk: 'Corpo da resposta copiado',
    copyFailed: 'Falha ao copiar, copie manualmente',
    requestFailed: 'Falha na requisição: {msg}',
  },

  result: {
    emptyTitle: 'Ainda sem resultado',
    emptyHint: 'Edite um comando curl à esquerda, depois clique em "Executar" ou pressione {hotkey}',
    running: 'Executando...',
    metaTime: 'Tempo',
    metaSize: 'Tamanho',
    metaType: 'Tipo',
    metaExit: 'Saída',
    errorTitle: 'Erro de execução',
    stderrTitle: 'stderr',
    tabBody: 'Corpo',
    tabHeaders: 'Cabeçalhos',
    tabRaw: 'Bruto',
    actionCopy: 'Copiar',
    actionDownload: 'Baixar',
    emptyBody: '(corpo vazio)',
    emptyHeaders: '(sem cabeçalhos)',
  },

  consent: {
    title: 'Permitir salvar o histórico?',
    message:
      'Usamos cookies do navegador / armazenamento local para salvar seu histórico de execuções cURL. Os dados ficam no seu dispositivo e nunca são enviados a nenhum servidor.',
    accept: 'Aceitar',
    decline: 'Recusar',
  },

  history: {
    title: 'Histórico',
    empty: 'Nenhum histórico ainda',
    noMatch: 'Nenhum item correspondente',
    searchPlaceholder: 'Buscar comando ou URL...',
    clear: 'Limpar tudo',
    confirmClear: 'Limpar todo o histórico?',
    cleared: 'Histórico limpo',
    remove: 'Remover',
    untitled: '(sem URL)',
    disabledTitle: 'Histórico desativado',
    disabledMsg: 'Aceite o armazenamento local para salvar e ver seu histórico.',
    enabled: 'Histórico ativado',
  },

  theme: {
    title: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
    auto: 'Sistema',
  },

  engine: {
    title: 'Motor',
    browser: 'Navegador',
    browserHint: 'fetch direto · sem servidor · limitado por CORS',
    server: 'Proxy local',
    serverHint: 'Invoca curl local · suporte completo · requer servidor',
    corsHint:
      'Requisição falhou, provavelmente bloqueada pela política CORS do servidor de destino. Mude para «Proxy local» para enviar a requisição via seu curl local e contornar as restrições do navegador.',
    retryWithServer: 'Repetir via proxy local',
    unsupportedTitle: 'Algumas opções não são suportadas no navegador',
    desktop: 'Desktop',
    desktopHint: 'Rodando no app desktop · invoca curl do sistema diretamente',
    downloadDesktop: 'Baixar app desktop',
    desktopAppHint:
      'O app desktop invoca diretamente seu curl do sistema — sem restrições CORS, cabeçalhos ou TLS, sem necessidade de servidor.',
  },
};

export default messages;
