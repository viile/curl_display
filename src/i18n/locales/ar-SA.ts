import type { Messages } from './types';

const messages: Messages = {
  app: {
    title: 'cURL Runner',
    subtitle: 'تنفيذ محلي · تنسيق · عرض النتائج',
    docsLink: 'وثائق curl',
    language: 'اللغة',
  },

  meta: {
    description:
      'نفّذ وأعد تنسيق وعرض أوامر curl محليًا في متصفحك. عرض شجرة / خريطة ذهنية لـ JSON، 20 لغة، الوضع الداكن، وتطبيق سطح مكتب بدون قيود CORS.',
    keywords:
      'curl, أداة curl, curl عبر الإنترنت, منسق JSON, شجرة JSON, خريطة ذهنية JSON, عميل HTTP, اختبار API, بديل postman, عميل REST',
  },

  editor: {
    run: 'تشغيل',
    running: 'قيد التشغيل',
    format: 'تنسيق',
    minify: 'تصغير',
    copy: 'نسخ',
    clear: 'مسح',
    placeholder:
      'الصق أو اكتب أمر curl هنا...\n\nمثال:\ncurl https://httpbin.org/post -X POST -H \'Content-Type: application/json\' -d \'{"a":1}\'',
    statusLines: '{n} سطر',
    statusChars: '{n} حرف',
    statusHint: 'Tab = مسافتان · {run} تشغيل · {format} تنسيق',
  },

  messages: {
    emptyCommand: 'يرجى إدخال أمر curl',
    formatted: 'تم التنسيق',
    formatFailed: 'فشل التنسيق: {msg}',
    minifyFailed: 'فشل التصغير: {msg}',
    copied: 'تم النسخ إلى الحافظة',
    copyBodyOk: 'تم نسخ نص الاستجابة',
    copyFailed: 'فشل النسخ، يرجى النسخ يدويًا',
    requestFailed: 'فشل الطلب: {msg}',
  },

  result: {
    emptyTitle: 'لا توجد نتيجة بعد',
    emptyHint: 'حرّر أمر curl على اليسار، ثم انقر على «تشغيل» أو اضغط {hotkey}',
    running: 'قيد التشغيل...',
    metaTime: 'الوقت',
    metaSize: 'الحجم',
    metaType: 'النوع',
    metaExit: 'الخروج',
    errorTitle: 'خطأ في التنفيذ',
    stderrTitle: 'stderr',
    tabBody: 'النص',
    tabHeaders: 'الترويسات',
    tabRaw: 'خام',
    actionCopy: 'نسخ',
    actionDownload: 'تنزيل',
    emptyBody: '(نص فارغ)',
    emptyHeaders: '(لا توجد ترويسات)',
    formatLabel: 'التنسيق',
    formatText: 'نص',
    formatTree: 'شجرة',
    formatMind: 'خريطة ذهنية',
  },

  consent: {
    title: 'هل تسمح بحفظ السجل؟',
    message:
      'نستخدم ملفات تعريف الارتباط / التخزين المحلي للمتصفح لحفظ سجل تنفيذ cURL. تبقى البيانات على جهازك ولا يتم رفعها إلى أي خادم.',
    accept: 'موافق',
    decline: 'رفض',
  },

  history: {
    title: 'السجل',
    empty: 'لا يوجد سجل بعد',
    noMatch: 'لا توجد نتائج مطابقة',
    searchPlaceholder: 'ابحث في الأوامر أو الروابط...',
    clear: 'مسح الكل',
    confirmClear: 'مسح كل السجل؟',
    cleared: 'تم مسح السجل',
    remove: 'حذف',
    untitled: '(بدون رابط)',
    disabledTitle: 'السجل معطّل',
    disabledMsg: 'وافق على التخزين المحلي لحفظ ومراجعة السجل.',
    enabled: 'تم تفعيل السجل',
  },

  theme: {
    title: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    auto: 'تلقائي',
  },

  engine: {
    title: 'محرك التنفيذ',
    browser: 'المتصفح',
    browserHint: 'fetch مباشر · بدون خادم · مقيد بـ CORS',
    server: 'وكيل محلي',
    serverHint: 'يستدعي curl المحلي · دعم كامل · يتطلب خادمًا',
    corsHint:
      'فشل الطلب، على الأرجح بسبب سياسة CORS للخادم المستهدف. بدّل إلى «وكيل محلي» لإرسال الطلب عبر curl المحلي وتجاوز قيود المتصفح.',
    retryWithServer: 'إعادة المحاولة عبر الوكيل المحلي',
    unsupportedTitle: 'بعض الخيارات غير مدعومة في المتصفح',
    desktop: 'تطبيق سطح المكتب',
    desktopHint: 'يعمل داخل تطبيق سطح المكتب · يستدعي curl المحلي مباشرة',
    downloadDesktop: 'تحميل تطبيق سطح المكتب',
    desktopAppHint:
      'يستدعي تطبيق سطح المكتب curl المحلي مباشرة — بدون قيود CORS أو رؤوس أو TLS، وبدون خادم.',
  },
};

export default messages;
