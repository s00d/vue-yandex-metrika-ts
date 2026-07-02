# Changelog

## 2.0.0

- Build output moved from `lib/` to `dist/` with dual CJS/ESM bundles
- Added Vue 3 support via `vue-yandex-metrika-ts/vue3`
- Added explicit Vue 2 subpath `vue-yandex-metrika-ts/vue2`
- Root import remains Vue 2 compatible with 1.x usage
- Added `vue-yandex-metrika-ts/helpers` subpath with `loadMetrikaScript`, `createMetrika`, `startTracking`
- Replaced callback-based `loadScript` with Promise-based `loadMetrikaScript`
- Development mode no longer loads Yandex tag.js (mock metrika only)
- Vite 8 library build and Vitest coverage
- GitHub Actions CI (replaces Travis)
- Vue 3 `useMetrika()` composable and `metrikaInjectionKey`
- Complete Metrika API types: `firstPartyParams`, `firstPartyParamsHashed`
- Visit params support arbitrary keys (`MetrikaVisitParams`)
- Optional `hit()` url; extended counter init options (`sendTitle`, `ssr`, `ecommerce`, `accurateTrackBounce`)
