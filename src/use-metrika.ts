import { inject, type InjectionKey } from 'vue'
import type { YaMetrika } from './types'

export const metrikaInjectionKey: InjectionKey<YaMetrika> = Symbol('vue-yandex-metrika')

export function useMetrika(): YaMetrika {
  const metrika = inject(metrikaInjectionKey, null)
  if (!metrika) {
    throw new Error('[vue-yandex-metrika] useMetrika() must be used after app.use(VueYandexMetrika)')
  }
  return metrika
}
