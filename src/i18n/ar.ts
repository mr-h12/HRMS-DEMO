/**
 * English → Arabic dictionary for the whole UI.
 * Keys are the exact English text as rendered. Template keys use {n0}, {n1}… for numbers
 * and {p0}, {p1}… for person names (see translator.ts).
 */

import { AR_DATA } from './ar-data'
import { AR_UI } from './ar-ui'

const MONTHS: [string, string, string][] = [
  ['Jan', 'January', 'يناير'], ['Feb', 'February', 'فبراير'], ['Mar', 'March', 'مارس'], ['Apr', 'April', 'أبريل'],
  ['May', 'May', 'مايو'], ['Jun', 'June', 'يونيو'], ['Jul', 'July', 'يوليو'], ['Aug', 'August', 'أغسطس'],
  ['Sep', 'September', 'سبتمبر'], ['Oct', 'October', 'أكتوبر'], ['Nov', 'November', 'نوفمبر'], ['Dec', 'December', 'ديسمبر'],
]

const dateTemplates: Record<string, string> = {}
for (const [abbr, full, ar] of MONTHS) {
  dateTemplates[abbr] = ar
  dateTemplates[full] = ar
  dateTemplates[`${abbr} {n0}`] = `{n0} ${ar}`
  dateTemplates[`${full} {n0}`] = `${ar} {n0}`
  dateTemplates[`${abbr} {n0}–{n1}`] = `{n0}–{n1} ${ar}`
  dateTemplates[`${abbr} {n0}, {n1}`] = `{n0} ${ar} {n1}`
  dateTemplates[`${full} {n0}, {n1}`] = `{n0} ${ar} {n1}`
  dateTemplates[`${abbr} {n0} · {n1}d`] = `{n0} ${ar} · {n1} ي`
}
// Headcount chart labels are month + 2-digit year ("Nov 25" = November 2025).
for (const [abbr, , ar] of MONTHS) for (const y of ['25', '26']) dateTemplates[`${abbr} ${y}`] = `${ar} 20${y}`

export const AR: Record<string, string> = {
  ...dateTemplates,
  ...AR_DATA,
  ...AR_UI,

  /* ---------- Brand & shell ---------- */
  'HRMS': 'نظام الموارد البشرية',
  'DEMO': 'تجريبي',
  'HRMS DEMO home': 'الصفحة الرئيسية',
  'Northwind Group': 'مجموعة نورثويند',
  'Viewing as:': 'العرض كـ:',
  'Employee': 'موظف',
  'Manager': 'مدير',
  'HR Admin': 'مسؤول الموارد البشرية',
  'Switch demo role': 'تبديل الدور التجريبي',
  'Ahmed Hassan · Self-service': 'أحمد حسن · الخدمة الذاتية',
  'Mohamed Ali · Team of {n0}': 'محمد علي · فريق من {n0}',
  'Mariam Hassan · Company-wide': 'مريم حسن · على مستوى الشركة',
  'Demo mode — no authentication. Switching roles changes navigation, data, permissions and notifications.':
    'وضع العرض التجريبي — بدون تسجيل دخول. تبديل الدور يغيّر القوائم والبيانات والصلاحيات والإشعارات.',
  'Employee workspace': 'مساحة الموظف',
  'Manager workspace': 'مساحة المدير',
  'HR Admin workspace': 'مساحة مسؤول الموارد البشرية',
  'Employee navigation': 'قائمة الموظف',
  'Manager navigation': 'قائمة المدير',
  'HR Admin navigation': 'قائمة الموارد البشرية',
  'Demo environment': 'بيئة تجريبية',
  'Data is simulated. Use the role switcher to explore each experience.': 'البيانات محاكاة. استخدم مبدّل الأدوار لاستكشاف كل تجربة.',
  'Help & support': 'المساعدة والدعم',
  'Open menu': 'فتح القائمة',
  'Expand sidebar': 'توسيع الشريط الجانبي',
  'Collapse sidebar': 'طي الشريط الجانبي',
  'Toggle theme': 'تبديل المظهر',
  'Dark mode': 'الوضع الداكن',
  'Light mode': 'الوضع الفاتح',
  'Open profile menu': 'فتح قائمة الملف الشخصي',
  'Search': 'بحث',
  'Close': 'إغلاق',

  /* ---------- Navigation ---------- */
  'Dashboard': 'لوحة التحكم',
  'My Profile': 'ملفي الشخصي',
  'Attendance': 'الحضور',
  'My Leave': 'إجازاتي',
  'My Payslips': 'قسائم راتبي',
  'My Documents': 'مستنداتي',
  'Performance': 'الأداء',
  'Requests': 'الطلبات',
  'My Team': 'فريقي',
  'Leave': 'الإجازات',
  'Approvals': 'الموافقات',
  'Reports': 'التقارير',
  'Employees': 'الموظفون',
  'Payroll': 'الرواتب',
  'Recruitment': 'التوظيف',
  'Training': 'التدريب',
  'Documents': 'المستندات',
  'Settings': 'الإعدادات',
  'Preferences': 'التفضيلات',
  'Notifications': 'الإشعارات',
  'Sign out': 'تسجيل الخروج',
}
