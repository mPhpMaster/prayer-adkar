/**
 * Multi-language support for Dhikr Counter App
 * Supports: Arabic, English, Thai
 */

export const LANGUAGES = {
  ar: {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    order: 1,
  },
  en: {
    code: 'en',
    name: 'English',
    dir: 'ltr',
    order: 2,
  },
  th: {
    code: 'th',
    name: 'ไทย',
    dir: 'ltr',
    order: 3,
  },
};

export const TRANSLATIONS = {
  ar: {
    // Header
    appTitle: 'ADHKAR - أذكار',
    appSubtitle: 'احفظ أورادك اليومية بسهولة',
    
    // Dhikr selection
    selectDhikr: 'اختر نوع الذكر',
    
    // Dhikr types
    dhikr_subhanallah: 'سبحان الله',
    dhikr_alhamdulillah: 'الحمد لله',
    dhikr_allahuakbar: 'الله أكبر',
    dhikr_lailahaillallah: 'لا إله إلا الله',
    dhikr_astaghfirullah: 'أستغفر الله',
    dhikr_lahawla: 'لا حول ولا قوة إلا بالله',
    
    // Counter
    currentCount: 'العدد الحالي',
    
    // Main button
    mainButton: 'سَبِّح',
    mainButtonSub: 'اضغط للعد',
    
    // Control buttons
    resetCounter: 'إعادة تعيين العداد',
    viewStatistics: 'عرض الإحصائيات',
    clearAllData: 'مسح جميع البيانات',
    
    // Statistics
    statistics: 'الإحصائيات',
    totalAll: 'إجمالي جميع الأذكار',
    currentSession: 'الجلسة الحالية',
    mostUsed: 'الأكثر استخداماً',
    times: 'مرة',
    savedTotals: 'إجمالي الأذكار المحفوظة',
    session: 'جلسة حالية',
    percentage: '%',
    backToCounter: 'العودة للعداد',
    
    // Alerts
    resetTitle: 'إعادة تعيين العداد',
    resetMessage: 'هل تريد إعادة تعيين العداد الحالي لـ',
    resetConfirm: 'إعادة تعيين',
    cancel: 'إلغاء',
    clearTitle: 'مسح جميع البيانات',
    clearMessage: 'هل أنت متأكد من مسح جميع البيانات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.',
    clearConfirm: 'مسح الكل',
    success: 'تم',
    dataCleared: 'تم مسح جميع البيانات بنجاح',
    
    // Language
    selectLanguage: 'اختر اللغة',
    language: 'اللغة',
  },
  
  en: {
    // Header
    appTitle: 'ADHKAR',
    appSubtitle: 'Keep track of your daily prayers',
    
    // Dhikr selection
    selectDhikr: 'Select Dhikr Type',
    
    // Dhikr types
    dhikr_subhanallah: 'Subhan Allah (Glory be to Allah)',
    dhikr_alhamdulillah: 'Alhamdulillah (Praise be to Allah)',
    dhikr_allahuakbar: 'Allahu Akbar (Allah is Greatest)',
    dhikr_lailahaillallah: 'La ilaha illallah (No god but Allah)',
    dhikr_astaghfirullah: 'Astaghfirullah (I seek forgiveness)',
    dhikr_lahawla: 'La hawla wala quwwata illa billah',
    
    // Counter
    currentCount: 'Current Count',
    
    // Main button
    mainButton: 'Count',
    mainButtonSub: 'Tap to count',
    
    // Control buttons
    resetCounter: 'Reset Counter',
    viewStatistics: 'View Statistics',
    clearAllData: 'Clear All Data',
    
    // Statistics
    statistics: 'Statistics',
    totalAll: 'Total All Dhikr',
    currentSession: 'Current Session',
    mostUsed: 'Most Used',
    times: 'times',
    savedTotals: 'Saved Totals',
    session: 'current session',
    percentage: '%',
    backToCounter: 'Back to Counter',
    
    // Alerts
    resetTitle: 'Reset Counter',
    resetMessage: 'Do you want to reset the current counter for',
    resetConfirm: 'Reset',
    cancel: 'Cancel',
    clearTitle: 'Clear All Data',
    clearMessage: 'Are you sure you want to clear all saved data? This action cannot be undone.',
    clearConfirm: 'Clear All',
    success: 'Success',
    dataCleared: 'All data cleared successfully',
    
    // Language
    selectLanguage: 'Select Language',
    language: 'Language',
  },
  
  th: {
    // Header
    appTitle: 'ADHKAR - อัซการ์',
    appSubtitle: 'บันทึกการภาวนาประจำวันของคุณ',
    
    // Dhikr selection
    selectDhikr: 'เลือกประเภทซิกร์',
    
    // Dhikr types
    dhikr_subhanallah: 'ซุบฮานัลลอฮ์ (พระเจ้าทรงบริสุทธิ์)',
    dhikr_alhamdulillah: 'อัลฮัมดุลิลลาฮ์ (สรรเสริญพระเจ้า)',
    dhikr_allahuakbar: 'อัลลอฮุอักบัร (พระเจ้ายิ่งใหญ่ที่สุด)',
    dhikr_lailahaillallah: 'ลาอิลาฮะอิลลัลลอฮ์ (ไม่มีพระเจ้านอกจากอัลลอฮ์)',
    dhikr_astaghfirullah: 'อัสตัฆฟิรุลลอฮ์ (ขอการอภัย)',
    dhikr_lahawla: 'ลาเฮาละวะลากุ๊วะตะอิลลาบิลลาฮ์',
    
    // Counter
    currentCount: 'จำนวนปัจจุบัน',
    
    // Main button
    mainButton: 'นับ',
    mainButtonSub: 'แตะเพื่อนับ',
    
    // Control buttons
    resetCounter: 'รีเซ็ตตัวนับ',
    viewStatistics: 'ดูสถิติ',
    clearAllData: 'ลบข้อมูลทั้งหมด',
    
    // Statistics
    statistics: 'สถิติ',
    totalAll: 'ซิกร์ทั้งหมด',
    currentSession: 'เซสชันปัจจุบัน',
    mostUsed: 'ใช้มากที่สุด',
    times: 'ครั้ง',
    savedTotals: 'ข้อมูลที่บันทึก',
    session: 'เซสชันปัจจุบัน',
    percentage: '%',
    backToCounter: 'กลับไปที่ตัวนับ',
    
    // Alerts
    resetTitle: 'รีเซ็ตตัวนับ',
    resetMessage: 'คุณต้องการรีเซ็ตตัวนับปัจจุบันสำหรับ',
    resetConfirm: 'รีเซ็ต',
    cancel: 'ยกเลิก',
    clearTitle: 'ลบข้อมูลทั้งหมด',
    clearMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลที่บันทึกทั้งหมด? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    clearConfirm: 'ลบทั้งหมด',
    success: 'สำเร็จ',
    dataCleared: 'ลบข้อมูลทั้งหมดเรียบร้อยแล้ว',
    
    // Language
    selectLanguage: 'เลือกภาษา',
    language: 'ภาษา',
  },
};

// Dhikr list mapped to translation keys
export const ADHKAR_KEYS = [
  'dhikr_subhanallah',
  'dhikr_alhamdulillah',
  'dhikr_allahuakbar',
  'dhikr_lailahaillallah',
  'dhikr_astaghfirullah',
  'dhikr_lahawla',
];
