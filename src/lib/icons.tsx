import type { ComponentType, SVGProps } from 'react'
import {
  BoltIcon,
  ChevronDoubleUpIcon,
  ExclamationTriangleIcon,
  FireIcon,
  FlagIcon,
  LockClosedIcon,
  MapIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  Squares2X2Icon,
  StarIcon,
  TrophyIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/solid'
import {
  CrossedSwordsIcon,
  FlameIcon,
  GemIcon,
  ShieldIcon,
  SwordIcon,
  SwordShieldIcon,
  VersusIcon,
} from '@/components/custom-icons'
import { ATTRIBUTE_KEYS, type AttributeKey } from './types'

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface IconVariant {
  id: string
  /** Shown under the icon in the mockup picker. */
  label: string
  Icon: IconComponent
}

export interface AttributeDefinition {
  key: AttributeKey
  /** Short code printed on the badge tooltip and used by the JSON export. */
  code: string
  /** Tailwind classes for the badge chip — background, ring and icon colour. */
  chip: string
  /** Accent used by the filter toggle when active. */
  accent: string
  /** Icons offered in the mockup picker; the first one is the default. */
  variants: IconVariant[]
  /** Only `awk` carries a numeric value (the signature level). */
  hasValue?: boolean
  /** Render the code as text on the badge instead of an icon (for `6★`). */
  textBadge?: boolean
}

/**
 * The seven per-champion attributes. Each one is a card badge, a filter toggle
 * and an entry in the icon mockup — driving all three from this single list is
 * what keeps them from drifting apart.
 */
export const ATTRIBUTES: Record<AttributeKey, AttributeDefinition> = {
  six: {
    key: 'six',
    code: '6★',
    // Text badge: a star glyph would read as the ASC medal, and this marker has
    // to be unmistakable — it decides which frame the portrait is drawn in.
    textBadge: true,
    chip: 'bg-slate-200 text-black ring-slate-400/60',
    accent: 'data-[on=true]:bg-slate-200 data-[on=true]:text-black data-[on=true]:border-slate-300',
    variants: [
      { id: 'star', label: 'Star (Heroicons)', Icon: StarIcon },
      { id: 'lock', label: 'Lock (Heroicons)', Icon: LockClosedIcon },
    ],
  },
  atk: {
    key: 'atk',
    code: 'ATK',
    chip: 'bg-rose-500/90 text-white ring-rose-300/60',
    accent: 'data-[on=true]:bg-rose-500 data-[on=true]:text-white data-[on=true]:border-rose-400',
    variants: [
      { id: 'sword', label: 'Sword', Icon: SwordIcon },
      { id: 'crossed', label: 'Crossed swords', Icon: CrossedSwordsIcon },
      { id: 'bolt', label: 'Bolt (Heroicons)', Icon: BoltIcon },
      { id: 'trending', label: 'Chevrons (Heroicons)', Icon: ChevronDoubleUpIcon },
    ],
  },
  def: {
    key: 'def',
    code: 'DEF',
    chip: 'bg-sky-500/90 text-white ring-sky-300/60',
    accent: 'data-[on=true]:bg-sky-500 data-[on=true]:text-white data-[on=true]:border-sky-400',
    variants: [
      { id: 'shield-check', label: 'Shield check (Heroicons)', Icon: ShieldCheckIcon },
      { id: 'shield', label: 'Shield', Icon: ShieldIcon },
      { id: 'shield-alert', label: 'Shield alert (Heroicons)', Icon: ShieldExclamationIcon },
    ],
  },
  dual: {
    key: 'dual',
    // One term, not "dual" plus "threat" — a champion that carries both attack
    // and defence duty.
    code: 'DUAL THREAT',
    chip: 'bg-violet-500/90 text-white ring-violet-300/60',
    accent:
      'data-[on=true]:bg-violet-500 data-[on=true]:text-white data-[on=true]:border-violet-400',
    variants: [
      { id: 'sword-shield', label: 'Sword + shield', Icon: SwordShieldIcon },
      { id: 'crossed', label: 'Crossed swords', Icon: CrossedSwordsIcon },
      { id: 'swap', label: 'Arrows (Heroicons)', Icon: ArrowsRightLeftIcon },
    ],
  },
  ga: {
    key: 'ga',
    // Guerre d'Alliance / Alliance War. Unrelated to "dual threat" — the key is
    // kept as `ga` so boards saved before the rename still load.
    code: 'AW',
    chip: 'bg-amber-500/90 text-black ring-amber-300/60',
    accent: 'data-[on=true]:bg-amber-500 data-[on=true]:text-black data-[on=true]:border-amber-400',
    variants: [
      { id: 'crossed', label: 'Crossed swords', Icon: CrossedSwordsIcon },
      { id: 'flag', label: 'Flag (Heroicons)', Icon: FlagIcon },
      { id: 'map', label: 'Map (Heroicons)', Icon: MapIcon },
      { id: 'fire', label: 'Fire (Heroicons)', Icon: FireIcon },
      { id: 'flame', label: 'Flame', Icon: FlameIcon },
      { id: 'warning', label: 'Warning (Heroicons)', Icon: ExclamationTriangleIcon },
    ],
  },
  bg: {
    key: 'bg',
    code: 'BG',
    chip: 'bg-emerald-500/90 text-black ring-emerald-300/60',
    accent:
      'data-[on=true]:bg-emerald-500 data-[on=true]:text-black data-[on=true]:border-emerald-400',
    variants: [
      { id: 'trophy', label: 'Trophy (Heroicons)', Icon: TrophyIcon },
      { id: 'versus', label: 'Versus', Icon: VersusIcon },
      { id: 'flag', label: 'Flag (Heroicons)', Icon: FlagIcon },
      { id: 'map', label: 'Map (Heroicons)', Icon: MapIcon },
      { id: 'grid', label: 'Grid (Heroicons)', Icon: Squares2X2Icon },
    ],
  },
  awk: {
    key: 'awk',
    code: 'AWK',
    chip: 'bg-cyan-400 text-black ring-cyan-200/70',
    accent: 'data-[on=true]:bg-cyan-400 data-[on=true]:text-black data-[on=true]:border-cyan-300',
    hasValue: true,
    variants: [
      { id: 'gem', label: 'Gem', Icon: GemIcon },
      { id: 'sparkles', label: 'Sparkles (Heroicons)', Icon: SparklesIcon },
      { id: 'star', label: 'Star (Heroicons)', Icon: StarIcon },
    ],
  },
}

export const ATTRIBUTE_LIST = ATTRIBUTE_KEYS.map((k) => ATTRIBUTES[k])

/** Resolve the icon component for an attribute, honouring the user's pick. */
export function attributeIcon(key: AttributeKey, chosenId?: string): IconComponent {
  const def = ATTRIBUTES[key]
  const chosen = chosenId ? def.variants.find((v) => v.id === chosenId) : undefined
  return chosen?.Icon ?? def.variants[0].Icon
}
