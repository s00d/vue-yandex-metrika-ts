/** Minimal router surface for autotracking — structurally compatible with vue-router v3 and v4 */
type MetrikaRouter = {
  afterEach(
    guard: (to: { path: string, name?: string | symbol | null }, from: { path: string, name?: string | symbol | null }) => void,
  ): void | (() => void)
}

export interface Options {
  accurateTrackBounce?: boolean | number
  childIframe?: boolean
  clickmap?: boolean
  defer?: boolean
  ecommerce?: boolean | string | Array<unknown>
  params?: Array<unknown> | Record<string, unknown>
  userParams?: Record<string, unknown>
  trackHash?: boolean
  trackLinks?: boolean
  trustedDomains?: Array<string>
  type?: number
  webvisor?: boolean
  triggerEvent?: boolean
  sendTitle?: boolean
  ssr?: boolean
  ut?: 'noindex'
}

export interface Config {
  id?: null | string
  options?: Options
  router?: MetrikaRouter | null
  env?: string
  scriptSrc?: string
  debug?: boolean
  ignoreRoutes?: Array<string>
  skipSamePath?: boolean
  errorLoad?: (err: Event | string | Error) => void
}

/** Visit/session parameters (hit, reachGoal, params) */
export interface MetrikaVisitParams {
  order_price?: number
  price?: number
  currency?: string
  [key: string]: unknown
}

export interface MetrikaHitOptions {
  callback?: () => void
  ctx?: unknown
  params?: MetrikaVisitParams
  referer?: string
  title?: string
}

export type SubParams = MetrikaHitOptions
/** @deprecated Use MetrikaHitOptions */
export type MetrikaHitParams = MetrikaHitOptions

export type MetrikaReachGoalParams = MetrikaVisitParams

export interface MetrikaFirstPartyParams {
  email?: string
  phone_number?: string
  first_name?: string
  last_name?: string
  yandex_cid?: number | string
}

export type MetrikaFirstPartyParamsHashed = MetrikaFirstPartyParams

/** Yandex Metrika counter API — single source of truth for types and mock methods */
export interface MetrikaMethods {
  addFileExtension(vals: string | Array<string>): void
  extLink(url: string, options?: MetrikaHitOptions): void
  file(url: string, options?: MetrikaHitOptions): void
  firstPartyParams(parameters: MetrikaFirstPartyParams): void
  firstPartyParamsHashed(parameters: MetrikaFirstPartyParamsHashed): void
  getClientID(callback: (clientID: string) => void): void
  hit(url?: string, options?: MetrikaHitOptions): void
  notBounce(options?: { callback?: () => void, ctx?: unknown }): void
  params(parameters: Array<unknown> | Record<string, unknown>): void
  reachGoal(
    target: string,
    params?: MetrikaReachGoalParams,
    callback?: () => void,
    ctx?: unknown,
  ): void
  replacePhones(): void
  setUserID(userID: string): void
  userParams(parameters: Record<string, unknown>): void
}

export type YaMetrika = MetrikaMethods

export interface MetrikaInitOptions extends Options {
  id?: null | string
}

export type MetrikaConstructor = new (params: MetrikaInitOptions) => YaMetrika

declare global {
  interface Window {
    yaCounters?: Record<string, YaMetrika>
    Ya: {
      Metrika2: MetrikaConstructor
    }
  }
}
