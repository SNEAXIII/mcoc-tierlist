import { useEffect, useState } from 'react'
import { readStored, writeStored } from './storage'

const STORAGE_NAME = 'prefs'

export interface DisplayPrefs {
  cardSize: number
  showNames: boolean
  showBadges: boolean
}

const DEFAULTS: DisplayPrefs = { cardSize: 64, showNames: false, showBadges: true }

/**
 * View-only preferences. Kept out of `BoardState` on purpose: they describe
 * this browser, not the tier list, so importing someone else's export must not
 * resize your cards.
 */
export function usePrefs(): [DisplayPrefs, (patch: Partial<DisplayPrefs>) => void] {
  const [prefs, setPrefs] = useState<DisplayPrefs>(DEFAULTS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = readStored(STORAGE_NAME)
      if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<DisplayPrefs>) })
    } catch {
      // Corrupted value — the defaults are fine.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeStored(STORAGE_NAME, JSON.stringify(prefs))
  }, [prefs, hydrated])

  return [prefs, (patch) => setPrefs((p) => ({ ...p, ...patch }))]
}
