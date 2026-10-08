import { DirectionProvider } from '@radix-ui/react-direction'
import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import { employees } from '@/data/employees'
import { initialCandidates } from '@/data/recruitment'
import { applyDocumentLang, getLang, setLang as setModuleLang, type Lang } from '@/i18n/lang'
import { registerPersonNames, startTranslating, stopTranslating } from '@/i18n/translator'

registerPersonNames([...employees.map((e) => e.name), ...initialCandidates.map((c) => c.name), 'Nada Hassan', 'Hassan Abdelmoneim', 'Heba Ali', 'Samia Hassan'])

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; toggleLang: () => void } | null>(null)

export function LanguageProvider({ children }: { children: (lang: Lang) => ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getLang)

  const setLang = useCallback((l: Lang) => {
    // Update the module value first so formatters read the new language during the remount render.
    setModuleLang(l)
    setLangState(l)
  }, [])
  const toggleLang = useCallback(() => setLang(getLang() === 'ar' ? 'en' : 'ar'), [setLang])

  // Before paint: set dir/lang and translate the freshly mounted tree.
  useLayoutEffect(() => {
    applyDocumentLang(lang)
    if (lang === 'ar') startTranslating()
    else stopTranslating()
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      <DirectionProvider dir={lang === 'ar' ? 'rtl' : 'ltr'}>{children(lang)}</DirectionProvider>
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
