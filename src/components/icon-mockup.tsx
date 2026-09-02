import Modal from './modal'
import AttributeBadges from './attribute-badges'
import AttributeIcon from './attribute-icon'
import { ATTRIBUTE_LIST, attributeChip } from '@/lib/icons'
import { cn } from '@/lib/cn'
import type { BoardActions } from '@/lib/use-board'
import type { AttributeKey } from '@/lib/types'
import type { Dictionary } from '@/i18n/locales'

interface IconMockupProps {
  open: boolean
  onClose: () => void
  iconChoices: Partial<Record<AttributeKey, string>>
  actions: BoardActions
  t: Dictionary
}

/**
 * Side-by-side comparison of every candidate icon per attribute, with a live
 * badge preview underneath. The in-game artwork is the default for every
 * attribute; the vector glyphs stay listed behind it, and adding another asset
 * is a new entry in `ATTRIBUTES[key].variants`, nothing else.
 */
export default function IconMockup({
  open,
  onClose,
  iconChoices,
  actions,
  t,
}: Readonly<IconMockupProps>) {
  const previewAttributes = {
    flags: Object.fromEntries(ATTRIBUTE_LIST.map((d) => [d.key, true])) as Partial<
      Record<AttributeKey, boolean>
    >,
    sig: 200,
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeLabel={t.close}
      title={t.iconMockup}
      className='sm:max-w-2xl'
    >
      <div className='flex flex-col gap-5'>
        <p className='text-xs text-muted-foreground'>{t.iconMockupHint}</p>

        <div className='rounded-lg border border-border bg-elevated p-3'>
          <AttributeBadges
            attributes={previewAttributes}
            iconChoices={iconChoices}
            size={22}
          />
        </div>

        {ATTRIBUTE_LIST.map((def) => {
          const selected = iconChoices[def.key] ?? def.variants[0].id
          return (
            <section
              key={def.key}
              className='flex flex-col gap-2'
            >
              <h3 className='text-xs font-bold uppercase tracking-wide text-muted-foreground'>
                {def.code}
                {def.hasValue && <span className='ml-2 font-normal normal-case'>(+ x200)</span>}
              </h3>
              <div className='flex flex-wrap gap-2'>
                {def.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type='button'
                    onClick={() => actions.setIconChoice(def.key, variant.id)}
                    aria-pressed={selected === variant.id}
                    className={cn(
                      'flex w-24 flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors',
                      selected === variant.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-muted-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1',
                        attributeChip(def.key, variant)
                      )}
                    >
                      {variant.text ?? (
                        <AttributeIcon
                          attribute={def.key}
                          chosenId={variant.id}
                          size={variant.src ? 26 : 20}
                        />
                      )}
                    </span>
                    <span className='text-[10px] leading-tight text-muted-foreground'>
                      {variant.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </Modal>
  )
}
