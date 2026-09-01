import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STATIC_ORIGIN } from './assets'

/** Cheap, already-needed asset used to probe the static host's CORS headers. */
const PROBE_URL = `${STATIC_ORIGIN}/static/frame/7_stars.png?cors-probe=1`

interface AssetMode {
  /** Whether portraits are currently requested with `crossOrigin="anonymous"`. */
  anonymous: boolean
  /** Called by an <img> that failed while in CORS mode, to drop back to plain loading. */
  reportFailure: () => void
}

const AssetModeContext = createContext<AssetMode>({ anonymous: true, reportFailure: () => {} })

/**
 * Whether the static host can be read cross-origin.
 *
 * The two things the app needs pull in opposite directions: a PNG export can
 * only read images fetched with `crossOrigin="anonymous"` (anything else taints
 * the canvas), but requesting that from a host which does *not* send
 * `Access-Control-Allow-Origin` makes the image fail to load outright.
 *
 * So: probe once, and let every portrait follow the answer. The probe alone is
 * not enough, though — `/static/` is served with a 30-day `max-age` and no
 * `Vary: Origin`, so a response cached from an earlier non-CORS visit gets
 * reused for a CORS request and fails even where the header is deployed. Any
 * image that errors in CORS mode therefore drops the whole app back to plain
 * loading, which keeps the artwork visible and makes the export refuse cleanly.
 */
export function useAnonymousImages(): boolean {
  return useContext(AssetModeContext).anonymous
}

export function useReportImageFailure(): () => void {
  return useContext(AssetModeContext).reportFailure
}

export function AnonymousImagesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [anonymous, setAnonymous] = useState(true)

  useEffect(() => {
    const probe = new Image()
    probe.crossOrigin = 'anonymous'
    probe.onerror = () => setAnonymous(false)
    probe.src = PROBE_URL
    return () => {
      probe.onerror = null
    }
  }, [])

  const reportFailure = useCallback(() => setAnonymous(false), [])
  const value = useMemo(() => ({ anonymous, reportFailure }), [anonymous, reportFailure])

  return <AssetModeContext.Provider value={value}>{children}</AssetModeContext.Provider>
}
