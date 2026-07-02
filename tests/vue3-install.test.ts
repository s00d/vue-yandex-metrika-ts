import { describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import install, { useMetrika } from '../src/vue3'

describe('useMetrika', () => {
  it('returns the same instance as $metrika', () => {
    let metrikaFromComposable: unknown

    const app = createApp(defineComponent({
      setup() {
        metrikaFromComposable = useMetrika()
        return () => h('div')
      },
    }))

    install(app, {
      id: '123',
      env: 'development',
    })

    app.mount(document.createElement('div'))

    expect(metrikaFromComposable).toBe(
      (app.config.globalProperties as { $metrika?: unknown }).$metrika,
    )
    expect(typeof (metrikaFromComposable as { hit?: unknown }).hit).toBe('function')
  })

  it('throws when the plugin is not installed', () => {
    let error: unknown

    const app = createApp(defineComponent({
      setup() {
        try {
          useMetrika()
        } catch (caught) {
          error = caught
        }
        return () => h('div')
      },
    }))

    app.mount(document.createElement('div'))

    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toContain('useMetrika()')
  })
})

describe('vue3 install', () => {
  it('attaches $metrika to globalProperties in development', () => {
    const appendSpy = vi.spyOn(document.head, 'appendChild')
    const app = createApp({ template: '<div />' })

    install(app, {
      id: '123',
      env: 'development',
      debug: true,
    })

    expect(appendSpy).not.toHaveBeenCalled()
    expect((app.config.globalProperties as { $metrika?: unknown }).$metrika).toBeDefined()
  })

  it('returns a promise in production when script loading is required', () => {
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      const script = node as HTMLScriptElement
      if (script.tagName === 'SCRIPT') {
        script.onload = () => {
          window.Ya = { Metrika2: vi.fn(() => ({ hit: vi.fn() })) } as unknown as Window['Ya']
        }
      }
      return node
    })

    const app = createApp({ template: '<div />' })
    const result = install(app, {
      id: '123',
      env: 'production',
    })

    expect(result).toBeInstanceOf(Promise)
  })
})
