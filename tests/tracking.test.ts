import { describe, expect, it, vi } from 'vitest'
import type { Config } from '../src/types'
import { startTracking } from '../src/helpers'

describe('startTracking', () => {
  it('registers router afterEach and sends hits', () => {
    const hit = vi.fn()
    const metrika = { hit } as { hit: typeof hit }
    let afterEachCb: ((to: { path: string, name?: string }, from: { path: string, name?: string }) => void) | undefined

    const router = {
      afterEach: (cb: typeof afterEachCb) => {
        afterEachCb = cb
      },
    }

    const config: Config = {
      router,
      skipSamePath: true,
      ignoreRoutes: ['hidden'],
    }

    startTracking(metrika as never, config)

    afterEachCb?.({ path: '/a', name: 'home' }, { path: '/b', name: 'prev' })
    afterEachCb?.({ path: '/same', name: 'same' }, { path: '/same', name: 'same' })
    afterEachCb?.({ path: '/hidden', name: 'hidden' }, { path: '/x', name: 'x' })

    expect(hit).toHaveBeenCalledTimes(1)
    expect(hit).toHaveBeenCalledWith('/a', { referer: '/b' })
  })
})
