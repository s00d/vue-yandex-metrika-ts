import type { Config, MetrikaMethods, YaMetrika } from './types'

const METRIKA_METHOD_NAMES = [
  'addFileExtension',
  'extLink',
  'file',
  'firstPartyParams',
  'firstPartyParamsHashed',
  'getClientID',
  'hit',
  'notBounce',
  'params',
  'reachGoal',
  'replacePhones',
  'setUserID',
  'userParams',
] as const satisfies ReadonlyArray<keyof MetrikaMethods>

export const SCRIPT_ID = 'vue-yandex-metrika-tag'
export const DEFAULT_SRC = 'https://mc.yandex.ru/metrika/tag.js'

const loaders = new Map<string, Promise<void>>()

export function resetMetrikaScriptCache(): void {
  loaders.clear()
}

function waitForMetrikaApi(
  timeoutMs = 3000,
  pollIntervalMs = 20,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const poll = () => {
      if (window.Ya?.Metrika2) {
        resolve()
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('[vue-yandex-metrika] Ya.Metrika2 is not available after script load'))
        return
      }

      setTimeout(poll, pollIntervalMs)
    }

    poll()
  })
}

function loadScriptElement(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

    if (existing) {
      if (window.Ya?.Metrika2) {
        resolve()
        return
      }

      const onLoad = () => {
        waitForMetrikaApi().then(resolve).catch(reject)
      }
      const onError = () => {
        reject(new Error(`[vue-yandex-metrika] Failed to load script: ${src}`))
      }

      existing.addEventListener('load', onLoad, { once: true })
      existing.addEventListener('error', onError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = src

    script.onload = () => {
      waitForMetrikaApi().then(resolve).catch(reject)
    }
    script.onerror = () => {
      reject(new Error(`[vue-yandex-metrika] Failed to load script: ${src}`))
    }

    document.head.appendChild(script)
  })
}

export function loadMetrikaScript(
  src = DEFAULT_SRC,
): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('[vue-yandex-metrika] Cannot load script in SSR environment'))
  }

  if (window.Ya?.Metrika2) {
    return Promise.resolve()
  }

  const cached = loaders.get(src)
  if (cached) {
    return cached
  }

  const promise = loadScriptElement(src).catch((error) => {
    loaders.delete(src)
    throw error
  })

  loaders.set(src, promise)
  return promise
}

function createMockMetrika(config: Config, attach: (metrika: YaMetrika) => void): YaMetrika {
  console.warn('[vue-yandex-metrika] Tracking is disabled, because env option is not "production"')
  if (config.debug) {
    console.warn('[vue-yandex-metrika] DEBUG is true: you\'ll see all API calls in the console')
  }

  const log = (method: string) => (...args: unknown[]) => {
    if (config.debug) {
      console.log(`[vue-yandex-metrika] ${method}:`, ...args)
    }
  }

  const metrika = METRIKA_METHOD_NAMES.reduce((acc, name) => {
    acc[name] = log(name)
    return acc
  }, {} as Record<keyof MetrikaMethods, (...args: unknown[]) => void>) as YaMetrika

  attach(metrika)
  return metrika
}

export function createMetrika(
  config: Config,
  attach: (metrika: YaMetrika) => void,
): YaMetrika {
  if (config.env === 'production') {
    const init = {
      id: config.id,
      ...config.options,
    }
    const metrika = new window.Ya.Metrika2(init)
    if (!window.yaCounters) {
      window.yaCounters = {}
    }
    window.yaCounters[`${config.id}`] = metrika
    attach(metrika)
    return metrika
  }

  return createMockMetrika(config, attach)
}

export function startTracking(metrika: YaMetrika, config: Config): void {
  if (!config.router) {
    return
  }

  config.router.afterEach((to, from) => {
    if (config.ignoreRoutes && typeof to.name === 'string' && config.ignoreRoutes.includes(to.name)) {
      return
    }
    if (config.skipSamePath && to.path === from.path) {
      return
    }
    metrika.hit(to.path, { referer: from.path })
  })
}
