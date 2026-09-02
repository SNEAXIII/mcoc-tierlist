import { attributeVariant } from '@/lib/icons'
import { cn } from '@/lib/cn'
import type { BadgeKey } from '@/lib/types'

interface AttributeIconProps {
  attribute: BadgeKey
  /** Variant id picked in the icon mockup; falls back to the attribute default. */
  chosenId?: string
  /** Glyph edge length in px. */
  size: number
  className?: string
}

/**
 * One attribute glyph: the in-game artwork when the chosen variant ships one,
 * the vector icon otherwise. The artwork is a PNG, so it ignores `currentColor`
 * and text colour — chips holding it use `attributeChip` to get the dark disc.
 *
 * Deliberately not lazy-loaded: the PNG export snapshots the DOM and waits on
 * every <img>, and a lazy badge off-screen would come out blank.
 */
export default function AttributeIcon({
  attribute,
  chosenId,
  size,
  className,
}: Readonly<AttributeIconProps>) {
  const variant = attributeVariant(attribute, chosenId)
  const style = { width: size, height: size }

  if (variant.src) {
    return (
      <img
        src={variant.src}
        alt=''
        aria-hidden
        draggable={false}
        className={cn('shrink-0 object-contain', className)}
        style={style}
      />
    )
  }

  const Icon = variant.Icon
  if (!Icon) return null
  return (
    <Icon
      className={cn('shrink-0', className)}
      style={style}
    />
  )
}
