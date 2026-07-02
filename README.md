<p align="center">
    <img src="https://i.imgur.com/iu7VdZ7.png" />
</p>

[![npm version](https://badge.fury.io/js/vue-yandex-metrika-ts.svg)](https://badge.fury.io/js/vue-yandex-metrika-ts)
[![npm downloads](https://img.shields.io/npm/dw/vue-yandex-metrika-ts)](https://badge.fury.io/js/vue-yandex-metrika-ts)
[![NPM license](https://img.shields.io/npm/l/vue-yandex-metrika-ts)](https://github.com/s00d/vue-yandex-metrika-ts/blob/master/LICENSE)
[![npm type definitions](https://img.shields.io/npm/types/vue-yandex-metrika-ts)](https://github.com/s00d/vue-yandex-metrika-ts)
[![CI](https://github.com/s00d/vue-yandex-metrika-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/s00d/vue-yandex-metrika-ts/actions/workflows/ci.yml)
[![donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.me/s00d)
[![GitHub Repo stars](https://img.shields.io/github/stars/s00d/vue-yandex-metrika-ts?style=social)](https://github.com/s00d/vue-yandex-metrika-ts)


# Vue Yandex Metrika Plugin with TypeScript

**vue-yandex-metrika-ts** allows you to send data about visited pages to [Yandex Metrika].

## Installation

Install with [yarn]:

```bash
$ yarn add vue-yandex-metrika-ts
```

Install with [npm]:

```bash
$ npm install vue-yandex-metrika-ts --save
```


## Ways to use

### Vue 2

Root import is Vue 2 compatible (same as v1.x):

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueYandexMetrika from 'vue-yandex-metrika-ts'

const router = new VueRouter({...})

Vue.use(VueYandexMetrika, {
  id: XXXXXXXX,
  router,
  env: process.env.NODE_ENV,
})
```

Explicit Vue 2 subpath (optional):

```javascript
import VueYandexMetrika from 'vue-yandex-metrika-ts/vue2'
```

### Vue 3

```javascript
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueYandexMetrika from 'vue-yandex-metrika-ts/vue3'

const app = createApp(App)
const router = createRouter({ history: createWebHistory(), routes: [] })

app.use(router)
app.use(VueYandexMetrika, {
  id: XXXXXXXX,
  router,
  env: import.meta.env.MODE,
})

app.mount('#app')
```

```javascript
import { useMetrika } from 'vue-yandex-metrika-ts/vue3'

// in <script setup>
const metrika = useMetrika()
metrika.reachGoal('SIGNUP')
```

### Helpers API

```javascript
import {
  loadMetrikaScript,
  createMetrika,
  startTracking,
} from 'vue-yandex-metrika-ts/helpers'
```

### <a name="autotracking">Autotracking</a>

Pass the `VueRouter` instance to the plugin and let it handle everything for you ([Metrika API] is also available):

```javascript
// Vue 2
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueYandexMetrika from 'vue-yandex-metrika-ts'

const router = new VueRouter({...})

Vue.use(VueYandexMetrika, {
  id: XXXXXXXX,
  router,
  env: process.env.NODE_ENV,
})
```


### <a name="manual">Manual tracking</a>

Works without `router`. Full [Metrika API] is available on `$metrika` / `getCurrentInstance()?.appContext.config.globalProperties.$metrika`.

```javascript
Vue.use(VueYandexMetrika, {
  id: XXXXXXXX,
  env: 'production',
  options: {
    // initial visit/visitor params
    params: { section: 'landing' },
    userParams: { UserID: 42 },
    // defer: true — disable auto pageview; call hit() manually on start
    // trackHash: true — track hash changes without vue-router
  },
})
```

```javascript
// page view with visit params
this.$metrika.hit('/checkout', {
  title: document.title,
  referer: '/cart',
  params: {
    order_price: 1990,
    currency: 'RUB',
    step: 'payment',
  },
})

// current URL (url is optional — defaults to window.location.href)
this.$metrika.hit()

// goals, visit and visitor params
this.$metrika.reachGoal('ORDER', { order_price: 1990, currency: 'RUB' })
this.$metrika.params({ event: 'filter', value: 'price' })
this.$metrika.userParams({ plan: 'pro' })

// advanced matching (HTTPS only)
this.$metrika.firstPartyParams({
  email: 'user@example.com',
  phone_number: '79001234567',
})
```

Autotracking with `router` sends only `hit(path, { referer })`. Use manual `hit()` when you need `title`, `params`, or other fields.

#### Options:

| Name           | Description                                                                                             | Required | Default                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- |
| id             | Your tracking `id`                                                                                      | True     | null                                                       |
| router         | [Autotracking](#autotracking) if the `router` is passed, otherwise: [manual tracking](#manual-tracking) | False    | null                                                       |
| env            | API calls are performed only if `env` is "production"                                                   | False    | development                                                |
| scriptSrc      | Src of metrika script to use                                                                            | False    | https://mc.yandex.ru/metrika/tag.js                        |
| debug          | If `env` is not "production" and `debug` is true: API calls are replaced by `console.log()`             | False    | false                                                      |
| ignoreRoutes   | List of ignored routes names                                                                            | False    | []                                                         |
| skipSamePath   | Do not track a page visit if previous and next routes URLs match                                        | False    | true                                                       |
| options        | Original Yandex Metrika [options](https://yandex.ru/support/metrika/code/counter-initialize.html)       | False    | {clickmap:true, trackLinks:true, accurateTrackBounce:true} |

#### Peer dependencies

- `vue` `^2.6.0 || ^3.0.0` (required)
- `vue-router` `^3.0.0 || ^4.0.0 || ^5.0.0` (optional, only for autotracking)

[Yandex Metrika]: https://metrika.yandex.ru
[yarn]: https://yarnpkg.com
[npm]: https://npmjs.com
[Metrika API]: https://yandex.ru/support/metrika/objects/method-reference.html

*   Big thanks to [`vue-yandex-metrika`](https://github.com/vchaptsev/vue-yandex-metrika) to learn how to write the plugin.
