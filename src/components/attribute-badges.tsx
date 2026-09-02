import AttributeIcon from './attribute-icon'
import { ATTRIBUTES, attributeChip, attributeVariant } from '@/lib/icons'
import { ATTRIBUTE_KEYS, type AttributeKey, type ChampionAttributes } from '@/lib/types'
import { cn } from '@/lib/cn'

interface AttributeBadgesProps {
  attributes: ChampionAttributes
  iconChoices: Partial<Record<AttributeKey, string>>
  /** Badge height in px — scales with the card so badges stay legible. */
  size: number
  className?: string
}

/**
 * The row of attribute chips drawn under a champion card. `awk` carries the
 * signature level, rendered inside the chip as "x200".
 */
export default function AttributeBadges({
  attributes,
  iconChoices,
  size,
  className,
}: Readonly<AttributeBadgesProps>) {
  const active = ATTRIBUTE_KEYS.filter((key) => attributes.flags[key])
  if (active.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-[2px]', className)}>
      {active.map((key) => {
        const def = ATTRIBUTES[key]
        const variant = attributeVariant(key, iconChoices[key])
        const value = key === 'awk' && attributes.sig ? `x${attributes.sig}` : null
        return (
          <span
            key={key}
            title={def.code}
            className={cn(
              'inline-flex items-center justify-center gap-[1px] rounded-full px-[2px] font-bold leading-none ring-1',
              attributeChip(key, variant)
            )}
            style={{ height: size, minWidth: size, fontSize: size * 0.62 }}
          >
            {variant.text ? (
              <span className='px-[1px]'>{variant.text}</span>
            ) : (
              <AttributeIcon
                attribute={key}
                chosenId={iconChoices[key]}
                size={size * (variant.src ? 0.82 : 0.7)}
              />
            )}
            {value && <span className='pr-[1px]'>{value}</span>}
          </span>
        )
      })}
    </div>
  )
}
