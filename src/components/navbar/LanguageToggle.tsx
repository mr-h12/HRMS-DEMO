import { useLanguage } from '@/hooks/useLanguage'
import { SegmentedControl } from './SegmentedControl'

/** Switches the entire interface between English and Arabic (RTL). */
export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <SegmentedControl
      label="Language"
      value={lang}
      onChange={setLang}
      options={[
        { value: 'en', label: 'English', content: <span lang="en" aria-hidden>EN</span> },
        { value: 'ar', label: 'العربية', content: <span lang="ar" aria-hidden>ع</span> },
      ]}
    />
  )
}
