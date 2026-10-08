import { AR } from './ar'
import { NAME_TOKENS } from './names'

/**
 * Runtime UI translator.
 *
 * Every string the app renders (JSX text, toasts, dialogs, chart labels, placeholders…) is
 * English at the source. While Arabic is active, a MutationObserver rewrites text nodes and
 * a few attributes using the dictionary in `ar.ts`. Lookups try, in order:
 *   1. an exact match ("Approve" → "موافقة")
 *   2. a person's name, transliterated token by token ("Ahmed Hassan" → "أحمد حسن")
 *   3. a template where numbers become {n0}, {n1}… and known names {p0}, {p1}…
 *      ("Showing 1–12 of 524" → key "Showing {n0}–{n1} of {n2}")
 * Switching back to English remounts the React tree, which recreates every node in English.
 */

const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'] as const
const SKIP_PARENTS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT'])
/** Identifiers, emails, file names and similar values stay as they are. */
const UNTRANSLATABLE = [
  /^(EMP|REQ|JOB|CAN|PS|TR|CD|N|D|G|FB|EV|A)-[\w-]+$/,
  /@/,
  /\.(pdf|csv|txt|docx|png|jpg|jpeg)\b/i,
  /^https?:/,
  /^[A-Z]{2}\d{2}[\s\d•]+/, // IBAN
  /^[A-Z]{1,3}$/, // avatar initials & acronyms without a dictionary entry
  /^[A-Z]+-[A-Z]+-\d+$/, // cost-center codes
  /^(A|B|AB|O)[+-]$/, // blood types
]

/** "Download X", "Actions for X"… — the prefix is translated and X is translated recursively. */
const PREFIX_RULES: [RegExp, string][] = [
  [/^Download (.+)$/, 'تنزيل $1'],
  [/^View (.+)$/, 'عرض $1'],
  [/^Actions for (.+)$/, 'إجراءات $1'],
  [/^Approve (.+)'s request$/, 'الموافقة على طلب $1'],
  [/^Reject (.+)'s request$/, 'رفض طلب $1'],
  [/^Approve (.+)$/, 'الموافقة على $1'],
  [/^Reject (.+)$/, 'رفض $1'],
  [/^Move (.+) back$/, 'إرجاع $1 للمرحلة السابقة'],
  [/^Continue as (.+)$/, 'المتابعة كـ $1'],
  [/^No results for “(.+)”$/, 'لا توجد نتائج لـ "$1"'],
  [/^Message sent to (.+)$/, 'تم إرسال الرسالة إلى $1'],
  [/^(.+) added$/, 'تمت إضافة $1'],
]

/** Composite labels like "Role · Department · EMP-1042" are translated segment by segment. */
const SEPARATORS = / (·|—) /
const ARABIC = /[\u0600-\u06FF]/


let personNames: string[] = []
let nameRegex: RegExp | null = null

export function registerPersonNames(names: string[]) {
  personNames = [...new Set(names)].filter((n) => n.includes(' ')).sort((a, b) => b.length - a.length)
  const escaped = personNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  nameRegex = escaped.length ? new RegExp(`(${escaped.join('|')})`, 'g') : null
}

export function translateName(name: string): string | null {
  const parts = name.trim().split(/\s+/)
  const out: string[] = []
  for (const p of parts) {
    const t = NAME_TOKENS[p]
    if (!t) return null
    out.push(t)
  }
  return out.join(' ')
}

export const misses = new Set<string>()

/** Keep numeric ranges ("12–14", "1–12") in reading order inside right-to-left text. */
const RANGE = /(\d[\d,.:]*)\s?–\s?(\d[\d,.:]*)/
const isolateRanges = (s: string) => s.replace(new RegExp(RANGE, 'g'), '\u2066$1–$2\u2069')

export function translate(raw: string): string | null {
  const out = translateInner(raw)
  if (out !== null) return isolateRanges(out)
  // Numeric-only text ("+20 100 482 7731", "−$1,577", "1–12") keeps left-to-right order inside RTL layouts.
  const t = raw.trim()
  if (/\d/.test(t) && !/[A-Za-z\u0600-\u06FF\u2066]/.test(t) && /[\s+−–$%:,.-]/.test(t)) return raw.replace(t, `\u2066${t}\u2069`)
  return null
}

function translateInner(raw: string): string | null {
  const text = raw.trim()
  if (!text || !/[A-Za-z]/.test(text)) return null

  const exact = AR[text]
  if (exact !== undefined) return wrap(raw, text, exact)
  if (UNTRANSLATABLE.some((r) => r.test(text)) || BRANDS.has(text)) return null

  const asName = translateName(text)
  if (asName) return wrap(raw, text, asName)

  // Template lookup: names → {p#}, numbers → {n#}
  const names: string[] = []
  const nums: string[] = []
  let key = nameRegex ? text.replace(nameRegex, (m) => `{p${names.push(m) - 1}}`) : text
  key = key.replace(/\{p\d+\}|\d+(?:[.,:]\d+)*/g, (m) => (m.startsWith('{p') ? m : `{n${nums.push(m) - 1}}`))
  if (key !== text) {
    const tpl = AR[key]
    if (tpl !== undefined) {
      const filled = tpl
        .replace(/\{n(\d+)\}/g, (_, i) => nums[Number(i)] ?? '')
        .replace(/\{p(\d+)\}/g, (_, i) => translateName(names[Number(i)]) ?? names[Number(i)])
      return wrap(raw, text, filled)
    }
  }

  // "Expires 2 نوفمبر 2026": an English lead-in followed by an already-Arabic date.
  const lead = SEPARATORS.test(text) ? null : text.match(/^([A-Za-z][A-Za-z .,'’&/-]*?)\s+([^A-Za-z]*[\u0600-\u06FF].*)$/)
  if (lead) {
    const head = AR[lead[1]]
    if (head !== undefined) return wrap(raw, text, `${head} ${lead[2]}`)
  }
  // Already Arabic (possibly with brand names such as "AXA" or "QNB") — nothing to do.
  if (ARABIC.test(text) && !SEPARATORS.test(text)) return null

  for (const [rx, tpl] of PREFIX_RULES) {
    const m = text.match(rx)
    if (m) return wrap(raw, text, tpl.replace('$1', translate(m[1]) ?? m[1]))
  }

  if (SEPARATORS.test(text)) {
    const parts = text.split(/( · | — )/)
    let changed = false
    const out = parts.map((part, i) => {
      if (i % 2) return part
      const t = translatePart(part)
      if (t !== null) changed = true
      return t ?? part
    })
    if (changed && parts.every((part, i) => i % 2 || translatePart(part) !== null || !needsTranslation(part))) return wrap(raw, text, out.join(''))
  }

  if (ARABIC.test(text) && text.split(/ · | — /).every((p) => ARABIC.test(p) || !needsTranslation(p))) return null

  misses.add(text)
  return null
}

const translatePart = (part: string) => {
  const size = misses.size
  const t = translate(part)
  // Segment misses are reported via the full string instead.
  if (misses.size > size) misses.delete(part.trim())
  return t
}

/** True when a segment contains words we would expect to translate. */
const needsTranslation = (part: string) => {
  const t = part.trim()
  return /[A-Za-z]/.test(t) && !UNTRANSLATABLE.some((r) => r.test(t)) && !BRANDS.has(t)
}

/** Company and product names stay in their original form. */
export const BRANDS = new Set([
  'Instabug', 'Paymob', 'Fawry', 'Careem', 'Valeo Egypt', 'Swvl', 'Talabat', 'Noon', 'Freelance', 'Raya Holding', 'Vodafone Egypt',
  'Orange Business', 'IBM Egypt', 'Etisalat by e&', 'STC', 'Salesforce', 'Oracle KSA', 'Zoho', 'HubSpot', 'Majid Al Futtaim', 'PwC Egypt',
  'CIB', 'Zendesk', 'Emirates NBD', 'Valu', 'Breadfast', 'Aramex', 'Matouk Bassiouny', 'Anghami', 'AXA', 'AWS', 'LinkedIn', 'Wuzzuf', 'Bayt',
  'PDF', 'DOCX', 'JPG', 'PNG', 'ESC', '⌘K', 'Go', 'Kafka', 'Node.js', 'TypeScript', 'PostgreSQL', 'Java', 'GITEX Global',
])

function wrap(raw: string, trimmed: string, translated: string) {
  const start = raw.indexOf(trimmed)
  return raw.slice(0, start) + translated + raw.slice(start + trimmed.length)
}

/* ---------------- DOM wiring ---------------- */

const written = new WeakMap<Node, string>()
let observer: MutationObserver | null = null

function translateTextNode(node: Text) {
  const parent = node.parentElement
  if (!parent || SKIP_PARENTS.has(parent.tagName) || parent.closest('[data-no-translate]')) return
  const value = node.nodeValue ?? ''
  if (written.get(node) === value) return
  const t = translate(value)
  if (t !== null && t !== value) {
    written.set(node, t)
    node.nodeValue = t
  }
}

function translateAttrs(el: Element) {
  if (el.closest('[data-no-translate]')) return
  for (const attr of ATTRS) {
    const v = el.getAttribute(attr)
    if (!v) continue
    const t = translate(v)
    if (t !== null && t !== v) el.setAttribute(attr, t)
  }
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return translateTextNode(root as Text)
  if (root.nodeType !== Node.ELEMENT_NODE) return
  translateAttrs(root as Element)
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
  let n = tw.nextNode()
  while (n) {
    if (n.nodeType === Node.TEXT_NODE) translateTextNode(n as Text)
    else translateAttrs(n as Element)
    n = tw.nextNode()
  }
}

export function startTranslating() {
  if (observer) return
  walk(document.body)
  observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData') translateTextNode(r.target as Text)
      else if (r.type === 'attributes') translateAttrs(r.target as Element)
      else r.addedNodes.forEach(walk)
    }
  })
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] })
}

export function stopTranslating() {
  observer?.disconnect()
  observer = null
}

// Exposed for QA tooling: list strings that had no translation.
if (typeof window !== 'undefined') (window as unknown as { __i18nMisses: Set<string> }).__i18nMisses = misses
