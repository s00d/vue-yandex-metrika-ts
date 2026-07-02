import { validateConfig } from './config'
import type { Config, YaMetrika } from './types'
import { createMetrika, loadMetrikaScript, startTracking } from './helpers'

export function bootstrap(
  config: Config,
  attach: (metrika: YaMetrika) => void,
): void | Promise<void> {
  validateConfig(config)

  const run = () => {
    const metrika = createMetrika(config, attach)
    startTracking(metrika, config)
  }

  if (config.env !== 'production') {
    run()
    return
  }

  return loadMetrikaScript(config.scriptSrc).then(run).catch((error: Error) => {
    if (config.errorLoad) {
      config.errorLoad(error)
    }
  })
}
