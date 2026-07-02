import Vue from 'vue';

import { loadScript, createMetrika, startTracking } from './helpers'
import {Config} from "./types";

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
    triggerEvent: false
  },
  router: null,
  env: 'development',
  scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
  debug: false,
  ignoreRoutes: [],
  skipSamePath: true
}


function createConfig (config: Config) {
  return {...defaultConfig, ...config }
}

function validateConfig (config: Config) {
  if (typeof document === 'undefined') {return}
  if (!config.id) {throw new Error('[vue-yandex-metrika] Please enter a Yandex Metrika tracking ID')}
  if (!config.router && config.env !== 'production') {
    return console.warn('[vue-yandex-metrika] Router is not passed, autotracking is disabled')
  }
}

export default function install (v: typeof Vue, options: Config = {scriptSrc: 'https://mc.yandex.ru/metrika/tag.js'}) {
  const config = createConfig(options)
  validateConfig(config)

  loadScript(() => {
    const metrika = createMetrika(v, config)
    startTracking(metrika, config)
  }, options.scriptSrc, (err) => {
    if(config.errorLoad) config.errorLoad(err)
  })
}
