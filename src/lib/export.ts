import { normalizeBoard } from './board'
import type { BoardState } from './types'

/** Width (px) an exported PNG aims for, so the board stays readable zoomed in. */
const TARGET_EXPORT_WIDTH = 2400
const MIN_EXPORT_SCALE = 2
const MAX_EXPORT_SCALE = 4
/**
 * Ceiling on the exported bitmap. Mobile Safari refuses to allocate a canvas
 * past roughly 16.7M pixels and hands back a blank one instead of throwing, so
 * a long board at 4x would export as an empty image on a phone.
 */
const MAX_EXPORT_PIXELS = 16_000_000
/** Safety net so a never-loading portrait can't block an export forever. */
const IMAGE_WAIT_TIMEOUT_MS = 8000
/** Long enough for the browser to have started the download before we revoke. */
const OBJECT_URL_TTL_MS = 60_000

function download(href: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = href
  link.rel = 'noopener'
  // In the document on purpose: a detached anchor's click is ignored by
  // Firefox and by several mobile browsers.
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function slugifyTitle(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return slug || 'mcoc-tierlist'
}

export function exportJson(board: BoardState): void {
  const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  download(url, `${slugifyTitle(board.title)}.json`)
  URL.revokeObjectURL(url)
}

/** Parse an uploaded export. Returns `null` when the file is not a board. */
export async function importJson(file: File): Promise<BoardState | null> {
  try {
    return normalizeBoard(JSON.parse(await file.text()))
  } catch {
    return null
  }
}

function exportScale(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect()
  if (!width) return MIN_EXPORT_SCALE
  const wanted = Math.min(MAX_EXPORT_SCALE, Math.max(MIN_EXPORT_SCALE, Math.ceil(TARGET_EXPORT_WIDTH / width)))
  // A tall board hits the canvas ceiling well before the width target does, and
  // going over it costs the whole export — so the cap wins, even below 2x.
  const cap = height ? Math.sqrt(MAX_EXPORT_PIXELS / (width * height)) : wanted
  return Math.max(1, Math.min(wanted, cap))
}

/**
 * Resolve once every <img> inside the element has finished loading — portraits
 * are lazy-loaded off-screen, and snapdom snapshots the DOM synchronously, so
 * without this the capture would contain blanks.
 */
async function waitForImages(element: HTMLElement): Promise<void> {
  const pending = Array.from(element.querySelectorAll('img'))
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        })
    )
  if (pending.length === 0) return
  await Promise.race([
    Promise.all(pending).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, IMAGE_WAIT_TIMEOUT_MS)),
  ])
}

/** Turn snapdom's data URL into a real file, so it can be downloaded or shared. */
async function toPngFile(dataUrl: string, filename: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob()
  return new File([blob], filename, { type: 'image/png' })
}

/**
 * Hand the file to the OS share sheet — "Save to Photos", "Save to Files", send
 * it to a chat. This is the only path that reliably lands a picture on a phone:
 * a `download` anchor on iOS opens the image in the tab instead of saving it.
 * Returns false when sharing is unavailable or the user dismissed the sheet, so
 * the caller can fall back to a plain download.
 */
async function shareFile(file: File): Promise<boolean> {
  if (!navigator.canShare?.({ files: [file] })) return false
  try {
    await navigator.share({ files: [file] })
    return true
  } catch (error) {
    // AbortError is the user closing the sheet — that is a finished export, not
    // a failure to retry through a download they did not ask for.
    return error instanceof DOMException && error.name === 'AbortError'
  }
}

/** Capture the tier board as a high-resolution PNG and hand it to the user. */
export async function exportPng(element: HTMLElement, board: BoardState): Promise<void> {
  await waitForImages(element)
  // Loaded on demand: snapdom is a third of the bundle and only the PNG
  // export needs it.
  const { snapdom } = await import('@zumer/snapdom')
  const png = await snapdom.toPng(element, { scale: exportScale(element), embedFonts: true })
  const filename = `${slugifyTitle(board.title)}.png`
  const file = await toPngFile(png.src, filename)

  if (await shareFile(file)) return

  // Blob URL rather than snapdom's data URL: a board's worth of base64 runs to
  // several megabytes, and mobile browsers drop a download that big.
  const url = URL.createObjectURL(file)
  download(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_TTL_MS)
}
