import type { ComponentType, SVGProps } from 'react'
import {
  BoltIcon,
  ChevronDoubleUpIcon,
  ExclamationTriangleIcon,
  FireIcon,
  FlagIcon,
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
import artAw from '@/assets/icons/aw-flame.png'
import artBg from '@/assets/icons/bg-helmet.png'
import artDef from '@/assets/icons/def-shield.png'
import artDual from '@/assets/icons/dual-sword-shield.png'
import artRank from '@/assets/icons/rank-badge.png'
import { ATTRIBUTE_KEYS, BADGE_KEYS, type AttributeKey, type BadgeKey } from './types'

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

export interface AttributeDefinition<K extends BadgeKey = BadgeKey> {
  key: K
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
 * Every marker the board knows: the six tags the user sets plus the derived
 * `dual` badge. Card badge, filter toggle and icon-picker entry all read from
 * this one table, which is what keeps them from drifting apart.
 *
 * Each marker leads with the in-game artwork; the vector variants stay behind
 * it in the picker as a fallback for anyone who prefers the flat look.
 */
export const ATTRIBUTES: { [K in BadgeKey]: AttributeDefinition<K> } = {
  six: {
    key: 'six',
    code: '6★',
    chip: 'bg-slate-200 text-black ring-slate-400/60',
    accent: 'data-[on=true]:bg-slate-200 data-[on=true]:text-black data-[on=true]:border-slate-300',
    // No glyph at all, on purpose: `six` draws no badge — it picks the portrait
    // frame, and the frame is what tells a 6★ champion from a 7★ one. The code
    // is still what the filter chip prints.
    variants: [{ id: 'text', label: '6★ (text)', text: '6★' }],
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
    // Derived, never tagged: a champion flagged both `atk` and `def` shows this
    // badge instead of those two. One term, not "dual" plus "threat".
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
      { id: 'art-aw', label: 'AW flame (game art)', src: artAw },
      { id: 'art-rank', label: 'Rank badge (game art)', src: artRank },
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
      { id: 'art-rank', label: 'Rank badge (game art)', src: artRank },
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

/** The tags the user can set — the filter row and both attribute editors. */
export const ATTRIBUTE_LIST: AttributeDefinition<AttributeKey>[] = ATTRIBUTE_KEYS.map(
  (k) => ATTRIBUTES[k]
)

/**
 * Markers with an icon to choose, in badge order. `six` is left out: it prints
 * no badge, so there would be nothing for a choice to change.
 */
export const ICON_PICKER_LIST: AttributeDefinition[] = BADGE_KEYS.map((k) => ATTRIBUTES[k])

/** Resolve the variant for a marker, honouring the user's pick. */
export function attributeVariant(key: BadgeKey, chosenId?: string): IconVariant {
  const def = ATTRIBUTES[key]
  const chosen = chosenId ? def.variants.find((v) => v.id === chosenId) : undefined
  return chosen ?? def.variants[0]
}

/** Badge chip classes — artwork needs the dark disc, flat glyphs the colour fill. */
export function attributeChip(key: BadgeKey, variant: IconVariant): string {
  const def = ATTRIBUTES[key]
  return (variant.src && def.artChip) || def.chip
}
