import {Config, YaMetrika} from "./types";
import Vue from 'vue';
import {Route} from "vue-router/types/router";

export function loadScript (callback: () => void, scriptSrc = 'https://mc.yandex.ru/metrika/tag.js', err?: OnErrorEventHandler) {
  const head = document.head || document.getElementsByTagName('head')[0]
  const script = document.createElement('script')

  script.async = true
  script.charset = 'utf-8'
  script.src = scriptSrc

  head.appendChild(script)

  script.onload = callback
  if(err) script.onerror = err
}

function createMockMetrika (v: typeof Vue, config: Config): YaMetrika {
  console.warn('[vue-yandex-metrika] Tracking is disabled, because env option is not "production"')
  if (config.debug) {
    console.warn('[vue-yandex-metrika] DEBUG is true: you\'ll see all API calls in the console')
  }

  const log = (method: string) => (...args: unknown[]) => {
    if (config.debug) {
      console.log(`[vue-yandex-metrika] ${method}:`, ...args)
    }
  }

  return v.prototype.$metrika = v.$metrika = {
    addFileExtension: log('addFileExtension'),
    extLink: log('extLink'),
    file: log('file'),
    getClientID: log('getClientID'),
    hit: log('hit'),
    notBounce: log('notBounce'),
    params: log('params'),
    reachGoal: log('reachGoal'),
    replacePhones: log('replacePhones'),
    setUserID: log('setUserID'),
    userParams: log('userParams'),
  } as YaMetrika
}

export function createMetrika (v: typeof Vue, config: Config) {
  if (config.env === 'production') {
    const init = {
      id: config.id,
      ...config.options
    }
    const metrika = new window.Ya.Metrika2(init);
    if(!window.yaCounters) window.yaCounters = {}
    window.yaCounters[`${config.id}`] = metrika
    return v.prototype.$metrika = v.$metrika = metrika
  }

  return createMockMetrika(v, config)
}

export function startTracking (metrika: YaMetrika, config: Config) {
  if (config.router) {
    config.router.afterEach(function (to: Route, from: Route) {
      if (config.ignoreRoutes && to.name && config.ignoreRoutes.indexOf(to.name) > -1) {return}
      if (config.skipSamePath && to.path == from.path) {return}
      metrika.hit(to.path, {referer: from.path})
    })
  }
}
