/** The six champion classes, in the order the class filter shows them. */
export const CHAMPION_CLASSES = ['Cosmic', 'Tech', 'Mutant', 'Skill', 'Science', 'Mystic'] as const

export type ChampionClass = (typeof CHAMPION_CLASSES)[number]

export interface Champion {
  /** Slug of the name — stable across data regenerations, used as the storage key. */
  id: string
  name: string
  championClass: ChampionClass
  /** Path on the artwork host, e.g. `/static/champions/groot.png`. */
  imageUrl: string
  /** Space-separated short names players type when searching ("abo immo"). */
  alias: string
  isAscendable: boolean
  hasPrefight: boolean
  isSevenStar: boolean
}

/** Per-champion tags the user sets; each one is also a filter. */
export const ATTRIBUTE_KEYS = ['six', 'atk', 'def', 'ga', 'bg', 'awk'] as const
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number]

/**
 * What a card badge can show. `dual` is not a tag anyone sets: a champion
 * carrying both `atk` and `def` *is* a dual threat, so the two collapse into
 * that single badge. `six` never gets a badge at all — the portrait frame is
 * what says whether a champion is 6★.
 */
export const DUAL_KEY = 'dual'
export type BadgeKey = AttributeKey | typeof DUAL_KEY

/** Badge keys in display order, `dual` sitting where `atk`/`def` would be. */
export const BADGE_KEYS = ['atk', 'def', 'dual', 'ga', 'bg', 'awk'] as const satisfies readonly BadgeKey[]

export interface ChampionAttributes {
  /** Set attributes. Absent key means unset. */
  flags: Partial<Record<AttributeKey, boolean>>
  /** Signature level shown as "x200" next to the awakening badge. */
  sig?: number
}

export interface Tier {
  id: string
  label: string
  /** Row background, any CSS colour — the label text auto-contrasts against it. */
  color: string
  /** Champion ids in this row, in display order. */
  championIds: string[]
}

/** Everything persisted to localStorage and written by the JSON export. */
export interface BoardState {
  version: 1
  tiers: Tier[]
  attributes: Record<string, ChampionAttributes>
  /** Chosen icon variant per badge — see `lib/icons.tsx`. */
  iconChoices: Partial<Record<BadgeKey, string>>
  title: string
}

export const FRAME_OPTIONS = ['7', '6', 'none'] as const
export type FrameOption = (typeof FRAME_OPTIONS)[number]
