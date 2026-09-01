/**
 * localStorage access, namespaced under the app's own prefix.
 *
 * Values written before the app was renamed live under the old prefix; reading
 * migrates them across on first access, so an existing board survives the
 * rename instead of silently resetting.
 */
const PREFIX = 'mcoc-tierlist:'
const LEGACY_PREFIX = 'mawster-tierlist:'

export function readStored(name: string): string | null {
  try {
    const current = localStorage.getItem(PREFIX + name)
    if (current !== null) return current
    const legacy = localStorage.getItem(LEGACY_PREFIX + name)
    if (legacy !== null) {
      localStorage.setItem(PREFIX + name, legacy)
      localStorage.removeItem(LEGACY_PREFIX + name)
    }
    return legacy
  } catch {
    // Storage blocked (private mode, site data disabled) — behave as if empty.
    return null
  }
}

export function writeStored(name: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + name, value)
  } catch {
    // Quota or blocked storage: the session stays usable, it just won't persist.
  }
}
