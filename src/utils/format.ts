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
  parseDate(iso).toLocaleDateString('en-US', opts)

export const formatShortDate = (iso: string) => formatDate(iso, { month: 'short', day: 'numeric' })

export function formatDateRange(start: string, end: string) {
  const s = parseDate(start)
  const e = parseDate(end)
  if (start === end) return formatShortDate(start)
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString('en-US', { month: 'short' })} ${s.getDate()}–${e.getDate()}`
  }
  return `${formatShortDate(start)} – ${formatShortDate(end)}`
}

export function relativeTime(iso: string, now = new Date()) {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  const days = Math.floor(diff / 86400)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function initials(name: string) {
  const parts = name.replace(/-/g, ' ').split(' ').filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function pluralize(count: number, word: string, plural = `${word}s`) {
  return `${count} ${count === 1 ? word : plural}`
}

/** "submitted 2d ago" / "submitted yesterday" / "submitted on Sep 28" */
export function submittedLabel(iso: string) {
  const rel = relativeTime(iso)
  return /ago|now|Yesterday/.test(rel) ? `submitted ${rel.toLowerCase()}` : `submitted on ${rel}`
}
