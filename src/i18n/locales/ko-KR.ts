import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: '로컬 실행 · 포맷팅 · 결과 시각화',
    docsLink: 'curl 문서',
    language: '언어',
  },

  meta: {
    description:
      '브라우저에서 curl 명령어를 로컬로 실행, 포맷팅, 시각화. JSON 트리 / 마인드맵 보기, 20개 언어, 다크 모드, CORS 제한 없는 데스크톱 앱.',
    keywords:
      'curl, curl 도구, curl 온라인, JSON 포매터, JSON 트리, JSON 마인드맵, HTTP 클라이언트, API 테스트, postman 대안, REST 클라이언트',
  },

  editor: {
    run: '실행',
    running: '실행 중',
    format: '포맷',
    minify: '압축',
    copy: '복사',
    clear: '지우기',
    placeholder:
      '여기에 curl 명령을 붙여넣거나 입력하세요...\n\n예:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} 줄',
    statusChars: '{n} 자',
    statusHint: 'Tab = 공백 2개 · {run} 실행 · {format} 포맷',
  },

  messages: {
    emptyCommand: 'curl 명령을 입력하세요',
    formatted: '포맷 완료',
    formatFailed: '포맷 실패: {msg}',
    minifyFailed: '압축 실패: {msg}',
    copied: '클립보드에 복사됨',
    copyBodyOk: '응답 본문이 복사됨',
    copyFailed: '복사 실패, 수동으로 복사하세요',
    requestFailed: '요청 실패: {msg}',
  },

  result: {
    emptyTitle: '아직 결과가 없습니다',
    emptyHint: '왼쪽에서 curl 명령을 편집한 후 "실행"을 클릭하거나 {hotkey}을(를) 누르세요',
    running: '실행 중...',
    metaTime: '시간',
    metaSize: '크기',
    metaType: '유형',
    metaExit: '종료',
    errorTitle: '실행 오류',
    stderrTitle: 'stderr',
    tabBody: '본문',
    tabHeaders: '헤더',
    tabRaw: '원본',
    actionCopy: '복사',
    actionDownload: '다운로드',
    emptyBody: '(빈 본문)',
    emptyHeaders: '(헤더 없음)',
    formatLabel: '형식',
    formatText: '텍스트',
    formatTree: '트리',
    formatMind: '마인드맵',
    searchPlaceholder: 'JSON 검색…',
    searchEmpty: '일치 항목 없음',
    searchPrev: '이전 일치',
    searchNext: '다음 일치',
  },

  consent: {
    title: '기록 저장을 허용하시겠습니까?',
    message:
      '브라우저 쿠키 / 로컬 저장소를 사용하여 cURL 실행 기록을 저장합니다. 데이터는 기기에만 저장되며 서버로 업로드되지 않습니다.',
    accept: '동의',
    decline: '거부',
  },

  history: {
    title: '기록',
    empty: '아직 기록이 없습니다',
    noMatch: '일치하는 항목 없음',
    searchPlaceholder: '명령 또는 URL 검색...',
    clear: '모두 지우기',
    confirmClear: '모든 기록을 지우시겠습니까?',
    cleared: '기록이 지워졌습니다',
    remove: '삭제',
    untitled: '(URL 없음)',
    disabledTitle: '기록이 비활성화됨',
    disabledMsg: '로컬 저장소를 허용하면 실행 기록을 저장하고 볼 수 있습니다.',
    enabled: '기록이 활성화됨',
    favorite: '즐겨찾기 추가',
    unfavorite: '즐겨찾기 해제',
    confirmClearKeepFav:
      '즐겨찾기가 아닌 모든 기록을 삭제할까요? 즐겨찾기 {count}개는 유지됩니다.',
  },

  theme: {
    title: '테마',
    light: '라이트',
    dark: '다크',
    auto: '시스템',
  },

  engine: {
    title: '실행 엔진',
    browser: '브라우저',
    browserHint: '직접 fetch · 서버 불필요 · CORS 제한',
    server: '로컬 프록시',
    serverHint: '로컬 curl 호출 · 완전 지원 · 서버 필요',
    corsHint:
      '요청 실패. 대상 서버의 CORS 정책으로 인해 차단되었을 가능성이 높습니다. 「로컬 프록시」로 전환하면 로컬 curl을 통해 요청을 보내 브라우저 제한을 우회할 수 있습니다.',
    retryWithServer: '로컬 프록시로 다시 시도',
    unsupportedTitle: '브라우저에서 지원되지 않는 플래그가 있습니다',
    desktop: '데스크톱',
    desktopHint: '데스크톱 앱에서 실행 중 · 시스템 curl 직접 호출',
    downloadDesktop: '데스크톱 앱 다운로드',
    desktopAppHint:
      '데스크톱 버전은 시스템 curl을 직접 호출합니다. CORS, 헤더, TLS 제한 없음. 서버 불필요.',
  },

  share: {
    button: '공유',
    title: '다운로드 링크 공유',
    subtitle: '데스크톱 앱 링크를 친구나 휴대폰으로 보내세요',
    copy: '링크 복사',
    copied: '링크가 클립보드에 복사되었습니다',
    qrHint: '모바일에서 스캔하여 다운로드',
    openLink: '다운로드 페이지 열기',
    nativeShare: '앱으로 공유…',
  },
};

export default messages;
