import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'

/** Switches the entire interface between English and Arabic (RTL). */
export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()
  const toArabic = lang === 'en'
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="h-9 gap-1.5 px-2 font-semibold sm:px-2.5"
      aria-label={toArabic ? 'التبديل إلى العربية' : 'Switch to English'}
      data-no-translate
    >
      <Languages className="hidden size-4 sm:block" />
      <span lang={toArabic ? 'ar' : 'en'} className={toArabic ? "font-['IBM_Plex_Sans_Arabic',sans-serif]" : ''}>
        <span className="hidden sm:inline">{toArabic ? 'العربية' : 'English'}</span>
        <span className="sm:hidden">{toArabic ? 'ع' : 'EN'}</span>
      </span>
    </Button>
  )
}
