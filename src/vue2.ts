import Vue from 'vue2'
import { bootstrap } from './bootstrap'
import { createConfig, defaultConfig } from './config'
import type { Config, Options, YaMetrika } from './types'

export { defaultConfig }
export type { Config, Options, YaMetrika }

type VueConstructor = typeof Vue & { $metrika?: YaMetrika }

function install(VueCtor: VueConstructor, options?: Config) {
  const config = createConfig(options)
  return bootstrap(config, (metrika) => {
    VueCtor.prototype.$metrika = metrika
    VueCtor.$metrika = metrika
  })
}

export default install
