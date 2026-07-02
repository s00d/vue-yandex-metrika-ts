import type { App } from 'vue'
import { bootstrap } from './bootstrap'
import { createConfig, defaultConfig } from './config'
import type { Config, Options, YaMetrika } from './types'
import { metrikaInjectionKey, useMetrika } from './use-metrika'

export { defaultConfig, metrikaInjectionKey, useMetrika }
export type { Config, Options, YaMetrika }

export function install(app: App, options?: Config): void | Promise<void> {
  const config = createConfig(options)
  return bootstrap(config, (metrika) => {
    app.config.globalProperties.$metrika = metrika
    app.provide(metrikaInjectionKey, metrika)
  })
}

export default install
