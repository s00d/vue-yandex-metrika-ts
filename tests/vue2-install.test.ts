import { describe, expect, it, vi } from 'vitest'
import Vue from 'vue2'
import install, { defaultConfig } from '../src/vue2'

describe('vue2 install', () => {
  it('attaches $metrika to prototype in development without loading script', () => {
    const appendSpy = vi.spyOn(document.head, 'appendChild')

    install(Vue, {
      id: '123',
      env: 'development',
      debug: true,
    })

    expect(appendSpy).not.toHaveBeenCalled()
    expect(Vue.prototype.$metrika).toBeDefined()
    expect((Vue as typeof Vue & { $metrika?: unknown }).$metrika).toBe(Vue.prototype.$metrika)
    expect(defaultConfig.env).toBe('development')
  })
})
