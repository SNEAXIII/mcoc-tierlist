import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ChampionPortrait from './champion-portrait'
import AttributeBadges from './attribute-badges'
import { cn } from '@/lib/cn'
import { FRAME_ASPECT } from '@/lib/assets'
import type { AttributeKey, Champion, ChampionAttributes, FrameOption } from '@/lib/types'

export interface ChampionCardProps {
  champion: Champion
  attributes: ChampionAttributes
  iconChoices: Partial<Record<AttributeKey, string>>
  size: number
  frame: FrameOption
  showName: boolean
  showBadges: boolean
  exporting?: boolean
  onOpen?: (championId: string) => void
}

/** Portrait, badges and (optionally) the name — the visual only, no drag wiring. */
export function ChampionCardVisual({
  champion,
  attributes,
  iconChoices,
  size,
  frame,
  showName,
  showBadges,
  exporting = false,
}: Readonly<Omit<ChampionCardProps, 'onOpen'>>) {
  return (
    <div
      className='flex flex-col items-center'
      style={{ width: size }}
    >
      <div
        className='relative'
        style={{ width: size, height: frame === 'none' ? size : size / FRAME_ASPECT }}
      >
        <ChampionPortrait
          champion={champion}
          size={size}
          frame={frame}
          exporting={exporting}
        />
      </div>
      {/* Badges sit below the portrait rather than over it — overlaid, they hid
          the very artwork the card exists to show. */}
      {showBadges && (
        <AttributeBadges
          attributes={attributes}
          iconChoices={iconChoices}
          size={Math.max(9, size * 0.17)}
          className='mt-0.5'
        />
      )}
      {showName && (
        <span
          className='mt-1 w-full truncate text-center leading-tight text-muted-foreground'
          style={{ fontSize: Math.max(8, size * 0.14) }}
          title={champion.name}
        >
          {champion.name}
        </span>
      )}
    </div>
  )
}

/**
 * A champion in the pool or in a tier: draggable via dnd-kit, and clickable to
 * open its attribute sheet. Memoised because a filter keystroke re-renders the
 * whole pool.
 */
function ChampionCard({ onOpen, ...visual }: Readonly<ChampionCardProps>) {
  const { champion } = visual
  const {
    attributes: dndAttributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: champion.id })

  return (
    <button
      ref={setNodeRef}
      type='button'
      {...dndAttributes}
      {...listeners}
      onClick={() => onOpen?.(champion.id)}
      aria-label={champion.name}
      className={cn(
        'no-select touch-manipulation rounded-md outline-none transition-shadow',
        'focus-visible:ring-2 focus-visible:ring-ring',
        isDragging && 'opacity-30'
      )}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <ChampionCardVisual {...visual} />
    </button>
  )
}

export default memo(ChampionCard)
