import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'Chạy cục bộ · Định dạng · Trực quan hóa',
    docsLink: 'tài liệu curl',
    language: 'Ngôn ngữ',
  },

  editor: {
    run: 'Chạy',
    running: 'Đang chạy',
    format: 'Định dạng',
    minify: 'Rút gọn',
    copy: 'Sao chép',
    clear: 'Xóa',
    placeholder:
      'Dán hoặc nhập lệnh curl tại đây...\n\nVí dụ:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} dòng',
    statusChars: '{n} ký tự',
    statusHint: 'Tab = 2 dấu cách · {run} chạy · {format} định dạng',
  },

  messages: {
    emptyCommand: 'Vui lòng nhập lệnh curl',
    formatted: 'Đã định dạng',
    formatFailed: 'Định dạng thất bại: {msg}',
    minifyFailed: 'Rút gọn thất bại: {msg}',
    copied: 'Đã sao chép vào clipboard',
    copyBodyOk: 'Đã sao chép nội dung phản hồi',
    copyFailed: 'Sao chép thất bại, vui lòng sao chép thủ công',
    requestFailed: 'Yêu cầu thất bại: {msg}',
  },

  result: {
    emptyTitle: 'Chưa có kết quả',
    emptyHint: 'Chỉnh sửa lệnh curl ở bên trái, sau đó nhấp «Chạy» hoặc nhấn {hotkey}',
    running: 'Đang chạy...',
    metaTime: 'Thời gian',
    metaSize: 'Kích thước',
    metaType: 'Loại',
    metaExit: 'Thoát',
    errorTitle: 'Lỗi thực thi',
    stderrTitle: 'stderr',
    tabBody: 'Nội dung',
    tabHeaders: 'Headers',
    tabRaw: 'Thô',
    actionCopy: 'Sao chép',
    actionDownload: 'Tải xuống',
    emptyBody: '(nội dung trống)',
    emptyHeaders: '(không có headers)',
  },

  consent: {
    title: 'Cho phép lưu lịch sử?',
    message:
      'Chúng tôi sử dụng cookie / lưu trữ cục bộ của trình duyệt để lưu lịch sử thực thi cURL. Dữ liệu chỉ ở trên thiết bị của bạn và không được gửi lên bất kỳ máy chủ nào.',
    accept: 'Đồng ý',
    decline: 'Từ chối',
  },

  history: {
    title: 'Lịch sử',
    empty: 'Chưa có lịch sử',
    noMatch: 'Không có kết quả phù hợp',
    searchPlaceholder: 'Tìm lệnh hoặc URL...',
    clear: 'Xóa tất cả',
    confirmClear: 'Xóa toàn bộ lịch sử?',
    cleared: 'Đã xóa lịch sử',
    remove: 'Xóa',
    untitled: '(không có URL)',
    disabledTitle: 'Lịch sử đang tắt',
    disabledMsg: 'Đồng ý sử dụng lưu trữ cục bộ để lưu và xem lịch sử.',
    enabled: 'Đã bật lịch sử',
  },

  theme: {
    title: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    auto: 'Tự động',
  },

  engine: {
    title: 'Engine',
    browser: 'Trình duyệt',
    browserHint: 'fetch trực tiếp · không cần server · giới hạn bởi CORS',
    server: 'Proxy nội bộ',
    serverHint: 'Gọi curl nội bộ · hỗ trợ đầy đủ · cần server',
    corsHint:
      'Yêu cầu thất bại, có thể bị chặn bởi chính sách CORS của máy chủ đích. Chuyển sang «Proxy nội bộ» để gửi yêu cầu qua curl cục bộ và bỏ qua giới hạn của trình duyệt.',
    retryWithServer: 'Thử lại qua proxy nội bộ',
    unsupportedTitle: 'Một số tham số không được hỗ trợ trong trình duyệt',
  },
};

export default messages;
