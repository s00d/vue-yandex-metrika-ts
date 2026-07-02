import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Config } from '../src/types'
import { createMetrika } from '../src/helpers'

describe('createMetrika', () => {
  const attach = vi.fn<(metrika: unknown) => void>()

  beforeEach(() => {
    attach.mockClear()
    delete (window as { Ya?: unknown }).Ya
    delete (window as { yaCounters?: unknown }).yaCounters
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates mock metrika in development without calling Ya.Metrika2', () => {
    const config: Config = {
      id: '123',
      env: 'development',
      debug: true,
    }

    const metrika = createMetrika(config, attach)

    expect(window.Ya).toBeUndefined()
    expect(attach).toHaveBeenCalledWith(metrika)
    metrika.hit('/test')
    expect(console.log).toHaveBeenCalled()
  })

  it('creates real metrika in production', () => {
    const metrikaInstance = { hit: vi.fn() }
    function Metrika2Mock(this: unknown) {
      return metrikaInstance
    }
    const Metrika2 = vi.fn(Metrika2Mock)
    window.Ya = { Metrika2 } as unknown as Window['Ya']

    const config: Config = {
      id: '123',
      env: 'production',
      options: { clickmap: true },
    }

    const metrika = createMetrika(config, attach)

    expect(Metrika2).toHaveBeenCalledWith({ id: '123', clickmap: true })
    expect(window.yaCounters?.['123']).toBe(metrikaInstance)
    expect(attach).toHaveBeenCalledWith(metrika)
    expect(metrika).toBe(metrikaInstance)
  })
})
