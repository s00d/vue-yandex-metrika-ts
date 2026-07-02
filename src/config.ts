import type { Config } from './types'

export const defaultConfig: Config = {
  id: null,
  options: {
    accurateTrackBounce: true,
    clickmap: true,
    defer: false,
    ecommerce: false,
    params: [],
    userParams: {},
    trackHash: false,
    trackLinks: true,
    type: 0,
    webvisor: false,
    triggerEvent: false,
  },
  router: null,
  env: 'development',
  scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
  debug: false,
  ignoreRoutes: [],
  skipSamePath: true,
}

export function createConfig(config: Config = {}): Config {
  return { ...defaultConfig, ...config }
}

export function validateConfig(config: Config): void {
  if (typeof document === 'undefined') {
    return
  }
  if (!config.id) {
    throw new Error('[vue-yandex-metrika] Please enter a Yandex Metrika tracking ID')
  }
}
