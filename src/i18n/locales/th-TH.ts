import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'รันบนเครื่อง · จัดรูปแบบ · แสดงผลลัพธ์',
    docsLink: 'เอกสาร curl',
    language: 'ภาษา',
  },

  meta: {
    description:
      'รัน จัดรูปแบบ และแสดงคำสั่ง curl ในเบราว์เซอร์ของคุณ รองรับมุมมอง JSON แบบต้นไม้ / แผนผังความคิด 20 ภาษา ธีมมืด และแอปเดสก์ท็อปไร้ข้อจำกัด CORS',
    keywords:
      'curl, เครื่องมือ curl, curl ออนไลน์, JSON formatter, ต้นไม้ JSON, แผนผังความคิด JSON, HTTP client, ทดสอบ API, ทางเลือก postman, REST client',
  },

  editor: {
    run: 'รัน',
    running: 'กำลังรัน',
    format: 'จัดรูปแบบ',
    minify: 'ย่อ',
    copy: 'คัดลอก',
    clear: 'ล้าง',
    placeholder:
      'วางหรือพิมพ์คำสั่ง curl ที่นี่...\n\nตัวอย่าง:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} บรรทัด',
    statusChars: '{n} ตัวอักษร',
    statusHint: 'Tab = 2 ช่องว่าง · {run} รัน · {format} จัดรูปแบบ',
  },

  messages: {
    emptyCommand: 'กรุณาป้อนคำสั่ง curl',
    formatted: 'จัดรูปแบบแล้ว',
    formatFailed: 'จัดรูปแบบล้มเหลว: {msg}',
    minifyFailed: 'ย่อล้มเหลว: {msg}',
    copied: 'คัดลอกไปยังคลิปบอร์ดแล้ว',
    copyBodyOk: 'คัดลอกเนื้อหาการตอบกลับแล้ว',
    copyFailed: 'คัดลอกไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง',
    requestFailed: 'คำขอล้มเหลว: {msg}',
  },

  result: {
    emptyTitle: 'ยังไม่มีผลลัพธ์',
    emptyHint: 'แก้ไขคำสั่ง curl ทางซ้าย แล้วคลิก «รัน» หรือกด {hotkey}',
    running: 'กำลังรัน...',
    metaTime: 'เวลา',
    metaSize: 'ขนาด',
    metaType: 'ประเภท',
    metaExit: 'ออก',
    errorTitle: 'ข้อผิดพลาดในการรัน',
    stderrTitle: 'stderr',
    tabBody: 'เนื้อหา',
    tabHeaders: 'ส่วนหัว',
    tabRaw: 'ดิบ',
    actionCopy: 'คัดลอก',
    actionDownload: 'ดาวน์โหลด',
    emptyBody: '(เนื้อหาว่าง)',
    emptyHeaders: '(ไม่มีส่วนหัว)',
    formatLabel: 'รูปแบบ',
    formatText: 'ข้อความ',
    formatTree: 'ต้นไม้',
    formatMind: 'แผนผังความคิด',
  },

  consent: {
    title: 'อนุญาตให้บันทึกประวัติหรือไม่?',
    message:
      'เราใช้คุกกี้ / ที่จัดเก็บภายในเบราว์เซอร์เพื่อบันทึกประวัติการรัน cURL ของคุณ ข้อมูลจะอยู่บนอุปกรณ์ของคุณเท่านั้นและจะไม่ส่งไปยังเซิร์ฟเวอร์ใด ๆ',
    accept: 'ยอมรับ',
    decline: 'ปฏิเสธ',
  },

  history: {
    title: 'ประวัติ',
    empty: 'ยังไม่มีประวัติ',
    noMatch: 'ไม่พบรายการที่ตรงกัน',
    searchPlaceholder: 'ค้นหาคำสั่งหรือ URL...',
    clear: 'ล้างทั้งหมด',
    confirmClear: 'ล้างประวัติทั้งหมด?',
    cleared: 'ล้างประวัติแล้ว',
    remove: 'ลบ',
    untitled: '(ไม่มี URL)',
    disabledTitle: 'ประวัติถูกปิดใช้งาน',
    disabledMsg: 'ยอมรับการจัดเก็บภายในเครื่องเพื่อบันทึกและดูประวัติ',
    enabled: 'เปิดใช้งานประวัติแล้ว',
  },

  theme: {
    title: 'ธีม',
    light: 'สว่าง',
    dark: 'มืด',
    auto: 'ตามระบบ',
  },

  engine: {
    title: 'เอนจิน',
    browser: 'เบราว์เซอร์',
    browserHint: 'fetch โดยตรง · ไม่ต้องใช้เซิร์ฟเวอร์ · จำกัดโดย CORS',
    server: 'พร็อกซีในเครื่อง',
    serverHint: 'เรียกใช้ curl ในเครื่อง · รองรับเต็มรูปแบบ · ต้องมีเซิร์ฟเวอร์',
    corsHint:
      'คำขอล้มเหลว อาจถูกบล็อกโดยนโยบาย CORS ของเซิร์ฟเวอร์ปลายทาง สลับไปใช้ «พร็อกซีในเครื่อง» เพื่อส่งคำขอผ่าน curl ในเครื่องและข้ามข้อจำกัดของเบราว์เซอร์',
    retryWithServer: 'ลองใหม่ผ่านพร็อกซีในเครื่อง',
    unsupportedTitle: 'พารามิเตอร์บางตัวไม่รองรับในเบราว์เซอร์',
    desktop: 'แอปเดสก์ท็อป',
    desktopHint: 'กำลังทำงานในแอปเดสก์ท็อป · เรียกใช้ curl ในระบบโดยตรง',
    downloadDesktop: 'ดาวน์โหลดแอปเดสก์ท็อป',
    desktopAppHint:
      'แอปเดสก์ท็อปเรียกใช้ curl ในระบบโดยตรง — ไม่มีข้อจำกัด CORS, header หรือ TLS, ไม่ต้องใช้เซิร์ฟเวอร์',
  },
};

export default messages;
