import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import ChampionPortrait from './champion-portrait'
import ToggleChip from './toggle-chip'
import { CHAMPIONS_BY_ID } from '@/data/champions'
import { attributesOf } from '@/lib/board'
import { readableTextColor } from '@/lib/color'
import { ATTRIBUTE_LIST, attributeIcon } from '@/lib/icons'
import { cn } from '@/lib/cn'
import type { BoardActions } from '@/lib/use-board'
import type { BoardState } from '@/lib/types'
import type { Dictionary } from '@/i18n/locales'

/** Digit shortcuts only reach this many tiers; beyond that, click. */
const HOTKEY_LIMIT = 9

interface ReviewModeProps {
  /** Queue snapshot, taken when the review started — filters cannot reshuffle it mid-run. */
  championIds: string[]
  board: BoardState
  actions: BoardActions
  t: Dictionary
  onClose: () => void
}

/**
 * One champion at a time, in the order the filtered pool showed them: pick a
 * tier and it advances. Built for ranking a whole class or a whole attribute in
 * one sitting, where dragging 60 cards one by one is the slow way round.
 *
 * The queue is a snapshot on purpose. Assigning a champion removes it from the
 * pool, so a live query would renumber the run under the user's fingers.
 */
export default function ReviewMode({
  championIds,
  board,
  actions,
  t,
  onClose,
}: Readonly<ReviewModeProps>) {
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState<Record<string, string>>({})

  const total = championIds.length
  const done = index >= total
  const champion = done ? undefined : CHAMPIONS_BY_ID.get(championIds[index])

  const assign = useCallback(
    (tierId: string) => {
      const championId = championIds[index]
      if (!championId) return
      actions.moveChampion(championId, tierId)
      setPlaced((p) => ({ ...p, [championId]: tierId }))
      setIndex((i) => i + 1)
    },
    [actions, championIds, index]
  )

  const skip = useCallback(() => setIndex((i) => Math.min(i + 1, total)), [total])
  const back = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never steal keys from the signature field or a tier rename.
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'Escape') return onClose()
      if (done) return
      if (e.key === 'ArrowLeft') return back()
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 's') return skip()
      const digit = Number(e.key)
      if (digit >= 1 && digit <= Math.min(HOTKEY_LIMIT, board.tiers.length)) {
        assign(board.tiers[digit - 1].id)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [assign, back, skip, onClose, done, board.tiers])

  const placedCount = Object.keys(placed).length
  const progress = total === 0 ? 0 : (Math.min(index, total) / total) * 100
  const currentTierId = champion ? placed[champion.id] : undefined
  const attrs = champion ? attributesOf(board, champion.id) : undefined

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-background'>
      <header className='flex shrink-0 items-center gap-3 border-b border-border px-4 py-3'>
        <span className='text-sm font-bold tabular-nums'>
          {Math.min(index + 1, total)} / {total}
        </span>
        <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-elevated'>
          <div
            className='h-full rounded-full bg-primary transition-[width]'
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          type='button'
          onClick={onClose}
          aria-label={t.quit}
          title={t.quit}
          className='rounded p-1 text-muted-foreground hover:text-foreground'
        >
          <XMarkIcon className='h-5 w-5' />
        </button>
      </header>

      {champion && attrs ? (
        <div className='flex flex-1 overflow-y-auto'>
          {/* `m-auto` rather than `justify-center`: a centred flex scroll container
              clips its own top once the content is taller than the viewport. */}
          <div className='m-auto flex flex-col items-center gap-4 px-4 py-5'>
            <ChampionPortrait
              champion={champion}
              size={200}
              frame={board.frame}
            />
            <div className='text-center'>
              <h2 className='text-xl font-black leading-tight'>{champion.name}</h2>
              <p className='text-xs text-muted-foreground'>
                {champion.championClass}
                {champion.isAscendable && ' · ASC'}
                {champion.hasPrefight && ' · Prefight'}
              </p>
            </div>

            <div className='flex flex-wrap justify-center gap-1.5'>
              {ATTRIBUTE_LIST.map((def) => {
                const Icon = attributeIcon(def.key, board.iconChoices[def.key])
                return (
                  <ToggleChip
                    key={def.key}
                    on={!!attrs.flags[def.key]}
                    onToggle={() => actions.toggleAttribute(champion.id, def.key)}
                    accent={def.accent}
                  >
                    <Icon className='h-4 w-4' />
                    {def.code}
                  </ToggleChip>
                )
              })}
            </div>

            {attrs.flags.awk && (
              <label className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
                {t.sigValue}
                <input
                  type='number'
                  min={0}
                  max={999}
                  value={attrs.sig ?? ''}
                  placeholder='200'
                  onChange={(e) =>
                    actions.setSignature(
                      champion.id,
                      e.target.value === '' ? undefined : Number(e.target.value)
                    )
                  }
                  className='w-20 rounded border border-border bg-input px-2 py-1 text-sm text-foreground outline-none focus:border-ring'
                />
              </label>
            )}

            <div className='grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
              {board.tiers.map((tier, i) => (
                <button
                  key={tier.id}
                  type='button'
                  onClick={() => assign(tier.id)}
                  style={{ backgroundColor: tier.color, color: readableTextColor(tier.color) }}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-lg font-black transition-transform',
                    'hover:scale-[1.02] active:scale-95',
                    currentTierId === tier.id &&
                      'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                  )}
                >
                  {i < HOTKEY_LIMIT && (
                    <kbd className='rounded bg-black/25 px-1.5 py-0.5 text-[11px] font-bold'>
                      {i + 1}
                    </kbd>
                  )}
                  {tier.label}
                </button>
              ))}
            </div>

            <p className='text-[11px] text-muted-foreground'>{t.reviewHint}</p>
          </div>
        </div>
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
          <CheckCircleIcon className='h-14 w-14 text-primary' />
          <h2 className='text-xl font-black'>{t.reviewDone}</h2>
          <p className='text-sm text-muted-foreground'>{t.reviewSummary(placedCount, total)}</p>
          <div className='flex gap-2'>
            {total > 0 && (
              <button
                type='button'
                onClick={back}
                className='rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground'
              >
                {t.previous}
              </button>
            )}
            <button
              type='button'
              onClick={onClose}
              className='rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground'
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      <footer className='flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3'>
        <button
          type='button'
          onClick={back}
          disabled={index === 0}
          className='inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          {t.previous}
        </button>
        <span className='text-xs text-muted-foreground'>{t.reviewPlaced(placedCount)}</span>
        <button
          type='button'
          onClick={skip}
          disabled={done}
          className='inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30'
        >
          {t.skip}
          <ArrowRightIcon className='h-4 w-4' />
        </button>
      </footer>
    </div>
  )
}
