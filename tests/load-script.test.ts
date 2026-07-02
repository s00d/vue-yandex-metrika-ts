import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_SRC,
  loadMetrikaScript,
  resetMetrikaScriptCache,
  SCRIPT_ID,
} from '../src/helpers'

describe('loadMetrikaScript', () => {
  beforeEach(() => {
    resetMetrikaScriptCache()
    document.head.innerHTML = ''
    delete (window as { Ya?: unknown }).Ya
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    resetMetrikaScriptCache()
  })

  it('resolves immediately when Ya.Metrika2 is already available', async () => {
    window.Ya = {
      Metrika2: vi.fn(),
    } as unknown as Window['Ya']

    const appendSpy = vi.spyOn(document.head, 'appendChild')
    await loadMetrikaScript()

    expect(appendSpy).not.toHaveBeenCalled()
  })

  it('deduplicates parallel loads into a single script tag', async () => {
    const first = loadMetrikaScript(DEFAULT_SRC)

    expect(document.getElementById(SCRIPT_ID)).toBeTruthy()

    const second = loadMetrikaScript(DEFAULT_SRC)
    expect(document.querySelectorAll(`#${SCRIPT_ID}`)).toHaveLength(1)

    window.Ya = { Metrika2: vi.fn() } as unknown as Window['Ya']
    const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement
    script.onload?.(new Event('load'))

    await Promise.all([first, second])
  })

  it('rejects in SSR environment', async () => {
    const originalWindow = globalThis.window
    // @ts-expect-error test SSR guard
    delete globalThis.window

    await expect(loadMetrikaScript()).rejects.toThrow('SSR environment')

    globalThis.window = originalWindow
  })

  it('rejects when script fails to load', async () => {
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      const script = node as HTMLScriptElement
      if (script.tagName === 'SCRIPT') {
        queueMicrotask(() => script.onerror?.(new Event('error')))
      }
      return node
    })

    await expect(loadMetrikaScript(DEFAULT_SRC)).rejects.toThrow('Failed to load script')
  })

  it('polls until Ya.Metrika2 becomes available', async () => {
    const promise = loadMetrikaScript(DEFAULT_SRC)
    const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement

    script.onload?.(new Event('load'))

    await new Promise((resolve) => {
      setTimeout(() => {
        window.Ya = { Metrika2: vi.fn() } as unknown as Window['Ya']
        resolve(undefined)
      }, 30)
    })

    await promise
  })

  it('resetMetrikaScriptCache clears deduplication', async () => {
    window.Ya = { Metrika2: vi.fn() } as unknown as Window['Ya']
    await loadMetrikaScript()
    resetMetrikaScriptCache()

    const appendSpy = vi.spyOn(document.head, 'appendChild')
    window.Ya = { Metrika2: vi.fn() } as unknown as Window['Ya']
    await loadMetrikaScript()

    expect(appendSpy).not.toHaveBeenCalled()
  })
})
