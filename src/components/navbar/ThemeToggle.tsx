import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { SegmentedControl } from './SegmentedControl'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <SegmentedControl
      label="Theme"
      value={theme}
      onChange={setTheme}
      options={[
        { value: 'light', label: 'Light mode', content: <Sun className="size-4" aria-hidden /> },
        { value: 'dark', label: 'Dark mode', content: <Moon className="size-4" aria-hidden /> },
      ]}
    />
  )
}
