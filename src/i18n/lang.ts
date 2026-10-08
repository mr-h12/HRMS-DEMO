export type Lang = 'en' | 'ar'

const KEY = 'hrms-lang'

function readLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

/**
 * The active language lives at module level so formatters can read it during render.
 * The app remounts its routes when the language changes, so every component re-renders.
 */
let current: Lang = readLang()

export const getLang = () => current
export const isArabic = () => current === 'ar'

export function setLang(lang: Lang) {
  current = lang
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* storage unavailable — language still applies for this session */
  }
}

/** Arabic dates keep Western digits so they match the rest of the numbers in the UI. */
export const dateLocale = () => (current === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US')

export function applyDocumentLang(lang: Lang) {
  const html = document.documentElement
  html.lang = lang
  html.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.title = lang === 'ar' ? 'نظام نورثويند للموارد البشرية — عرض توضيحي' : 'Northwind HRMS — Demo'
}
