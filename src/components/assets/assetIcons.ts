import { Car, HardHat, Laptop, Ruler, Smartphone, SunMedium, Wrench, type LucideIcon } from 'lucide-react'
import type { AssetCategory } from '@/types'

export const ASSET_ICONS: Record<AssetCategory, LucideIcon> = {
  Laptop: Laptop,
  'Mobile Phone': Smartphone,
  Vehicle: Car,
  'Power Tools': Wrench,
  'Safety Gear': HardHat,
  'Solar Test Equipment': SunMedium,
  'Survey Equipment': Ruler,
}
