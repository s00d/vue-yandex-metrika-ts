import type { YaMetrika } from '../types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $metrika: YaMetrika
  }
}

export {}
