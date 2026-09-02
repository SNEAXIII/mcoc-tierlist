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
import artAtk from '@/assets/icons/atk-sword.png'
import artAwk from '@/assets/icons/awk-gem.png'
import artAw from '@/assets/icons/aw-badge.png'
import artBg from '@/assets/icons/bg-helmet.png'
import artDef from '@/assets/icons/def-shield.png'
import artDual from '@/assets/icons/dual-sword-shield.png'
import artFlame from '@/assets/icons/flame.png'
import { ATTRIBUTE_KEYS, type AttributeKey } from './types'

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface IconVariant {
  id: string
  /** Shown under the icon in the mockup picker. */
  label: string
  /** In-game artwork bundled by Vite. Wins over `Icon` when both are set. */
  src?: string
  /** Vector glyph, used when the variant ships no artwork. */
  Icon?: IconComponent
  /** Drawn as text instead of a glyph — the "6★" marker. */
  text?: string
}

export interface AttributeDefinition {
  key: AttributeKey
  /** Short code printed on the badge tooltip and used by the JSON export. */
  code: string
  /** Tailwind classes for the badge chip — background, ring and icon colour. */
  chip: string
  /**
   * Chip used when the chosen variant is artwork. The PNGs carry their own
   * colours, so they are set on a dark disc with the attribute's colour kept as
   * the ring — a flat colour fill behind them muddies the artwork. Absent on
   * `six`, which has no artwork: the star count is the portrait frame.
   */
  artChip?: string
  /** Accent used by the filter toggle when active. */
  accent: string
  /** Icons offered in the mockup picker; the first one is the default. */
  variants: IconVariant[]
  /** Only `awk` carries a numeric value (the signature level). */
  hasValue?: boolean
}

/**
 * The seven per-champion attributes. Each one is a card badge, a filter toggle
 * and an entry in the icon mockup — driving all three from this single list is
 * what keeps them from drifting apart.
 *
 * Every attribute now leads with the in-game artwork; the vector variants stay
 * behind it in the picker as a fallback for anyone who prefers the flat look.
 */
export const ATTRIBUTES: Record<AttributeKey, AttributeDefinition> = {
  six: {
    key: 'six',
    code: '6★',
    chip: 'bg-slate-200 text-black ring-slate-400/60',
    accent: 'data-[on=true]:bg-slate-200 data-[on=true]:text-black data-[on=true]:border-slate-300',
    variants: [
      // No artwork here on purpose: the star count is carried by the portrait
      // frame. The text badge stays the marker — a star glyph would read as the
      // ASC medal, and this one decides which frame the portrait is drawn in.
      { id: 'text', label: '6★ (text)', text: '6★' },
      { id: 'star', label: 'Star (Heroicons)', Icon: StarIcon },
      { id: 'lock', label: 'Lock (Heroicons)', Icon: LockClosedIcon },
    ],
  },
  atk: {
    key: 'atk',
    code: 'ATK',
    chip: 'bg-rose-500/90 text-white ring-rose-300/60',
    artChip: 'bg-slate-950/85 text-white ring-rose-400/70',
    accent: 'data-[on=true]:bg-rose-500 data-[on=true]:text-white data-[on=true]:border-rose-400',
    variants: [
      { id: 'art-sword', label: 'Sword (game art)', src: artAtk },
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
    artChip: 'bg-slate-950/85 text-white ring-sky-400/70',
    accent: 'data-[on=true]:bg-sky-500 data-[on=true]:text-white data-[on=true]:border-sky-400',
    variants: [
      { id: 'art-shield', label: 'Shield (game art)', src: artDef },
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
    artChip: 'bg-slate-950/85 text-white ring-violet-400/70',
    accent:
      'data-[on=true]:bg-violet-500 data-[on=true]:text-white data-[on=true]:border-violet-400',
    variants: [
      { id: 'art-sword-shield', label: 'Sword + shield (game art)', src: artDual },
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
    artChip: 'bg-slate-950/85 text-white ring-amber-400/70',
    accent: 'data-[on=true]:bg-amber-500 data-[on=true]:text-black data-[on=true]:border-amber-400',
    variants: [
      { id: 'art-aw', label: 'AW badge (game art)', src: artAw },
      { id: 'art-flame', label: 'Flame (game art)', src: artFlame },
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
    artChip: 'bg-slate-950/85 text-white ring-emerald-400/70',
    accent:
      'data-[on=true]:bg-emerald-500 data-[on=true]:text-black data-[on=true]:border-emerald-400',
    variants: [
      { id: 'art-bg', label: 'BG helmet (game art)', src: artBg },
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
    artChip: 'bg-slate-950/85 text-white ring-cyan-300/70',
    accent: 'data-[on=true]:bg-cyan-400 data-[on=true]:text-black data-[on=true]:border-cyan-300',
    hasValue: true,
    variants: [
      { id: 'art-gem', label: 'Awakening gem (game art)', src: artAwk },
      { id: 'gem', label: 'Gem', Icon: GemIcon },
      { id: 'sparkles', label: 'Sparkles (Heroicons)', Icon: SparklesIcon },
      { id: 'star', label: 'Star (Heroicons)', Icon: StarIcon },
    ],
  },
}

export const ATTRIBUTE_LIST = ATTRIBUTE_KEYS.map((k) => ATTRIBUTES[k])

/** Resolve the variant for an attribute, honouring the user's pick. */
export function attributeVariant(key: AttributeKey, chosenId?: string): IconVariant {
  const def = ATTRIBUTES[key]
  const chosen = chosenId ? def.variants.find((v) => v.id === chosenId) : undefined
  return chosen ?? def.variants[0]
}

/** Badge chip classes — artwork needs the dark disc, flat glyphs the colour fill. */
export function attributeChip(key: AttributeKey, variant: IconVariant): string {
  const def = ATTRIBUTES[key]
  return (variant.src && def.artChip) || def.chip
}
