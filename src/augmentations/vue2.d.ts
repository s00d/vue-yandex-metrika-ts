import type { YaMetrika } from '../types'

declare module 'vue/types/vue' {
  interface Vue {
    $metrika: YaMetrika
  }

  interface VueConstructor {
    $metrika: YaMetrika
  }
}

export {}
