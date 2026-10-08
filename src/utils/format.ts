import { dateLocale, isArabic } from '@/i18n/lang'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const num = new Intl.NumberFormat('en-US')

export const formatCurrency = (value: number, cents = false) => (cents ? usd2 : usd).format(value)
export const formatNumber = (value: number) => num.format(value)
export const formatCompactCurrency = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2)}M` : value >= 1_000 ? `$${Math.round(value / 1_000)}K` : `$${value}`

/** Parses a YYYY-MM-DD string as a local date (avoids UTC off-by-one). */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  parseDate(iso).toLocaleDateString(dateLocale(), opts)

export const formatShortDate = (iso: string) => formatDate(iso, { month: 'short', day: 'numeric' })

export function formatDateRange(start: string, end: string) {
  const s = parseDate(start)
  const e = parseDate(end)
  if (start === end) return formatShortDate(start)
  if (s.getMonth() === e.getMonth()) {
    const month = s.toLocaleDateString(dateLocale(), { month: 'short' })
    return isArabic() ? `${s.getDate()}–${e.getDate()} ${month}` : `${month} ${s.getDate()}–${e.getDate()}`
  }
  return `${formatShortDate(start)} – ${formatShortDate(end)}`
}

export function relativeTime(iso: string, now = new Date()) {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000
  const ar = isArabic()
  if (diff < 60) return ar ? 'الآن' : 'Just now'
  if (diff < 3600) return ar ? `منذ ${Math.floor(diff / 60)} د` : `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return ar ? `منذ ${Math.floor(diff / 3600)} س` : `${Math.floor(diff / 3600)}h ago`
  const days = Math.floor(diff / 86400)
  if (days === 1) return ar ? 'أمس' : 'Yesterday'
  if (days < 7) return ar ? (days === 2 ? 'منذ يومين' : `منذ ${days} أيام`) : `${days}d ago`
  return new Date(iso).toLocaleDateString(dateLocale(), { month: 'short', day: 'numeric' })
}

export function initials(name: string) {
  const parts = name.replace(/-/g, ' ').split(' ').filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (isArabic()) return h < 12 ? 'صباح الخير' : 'مساء الخير'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Today's date in the active language, e.g. "Wednesday, October 7, 2026". */
export const todayLabel = () => new Date().toLocaleDateString(dateLocale(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

/** Date + time in the active language. */
export const formatDateTime = (iso: string) => new Date(iso).toLocaleString(dateLocale(), { dateStyle: 'medium', timeStyle: 'short' })

export function pluralize(count: number, word: string, plural = `${word}s`) {
  return `${count} ${count === 1 ? word : plural}`
}

/** "submitted 2d ago" / "submitted yesterday" / "submitted on Sep 28" */
export function submittedLabel(iso: string) {
  const rel = relativeTime(iso)
  if (isArabic()) return `قُدّم ${/منذ|الآن|أمس/.test(rel) ? rel : `في ${rel}`}`
  return /ago|now|Yesterday/.test(rel) ? `submitted ${rel.toLowerCase()}` : `submitted on ${rel}`
}
