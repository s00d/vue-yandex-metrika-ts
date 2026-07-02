import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  getLoadedModule,
  packageRootFromImportMeta,
  smokeLoadExports,
} from '../utils/publish-smoke'

const packageRoot = packageRootFromImportMeta(import.meta.url)
const pkg = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))

describe('vue-yandex-metrika-ts dist publish smoke', () => {
  it('loads root and vue2 entries (esm + cjs)', async () => {
    const rootMods = await smokeLoadExports(packageRoot, '.', ['esm', 'cjs'])
    const vue2Mods = await smokeLoadExports(packageRoot, './vue2', ['esm', 'cjs'])

    for (const [mods, subpath] of [[rootMods, '.'], [vue2Mods, './vue2']] as const) {
      expect(typeof getLoadedModule(mods, `${subpath}:import`).default).toBe('function')
      expect(typeof getLoadedModule(mods, `${subpath}:require`).default).toBe('function')
      expect(getLoadedModule(mods, `${subpath}:import`).defaultConfig).toBeTruthy()
    }
  })

  it('loads vue3 entry (esm + cjs)', async () => {
    const mods = await smokeLoadExports(packageRoot, './vue3', ['esm', 'cjs'])
    expect(typeof getLoadedModule(mods, './vue3:import').default).toBe('function')
    expect(typeof getLoadedModule(mods, './vue3:require').default).toBe('function')
  })

  it('loads helpers entry (esm + cjs)', async () => {
    const mods = await smokeLoadExports(packageRoot, './helpers', ['esm', 'cjs'])
    expect(typeof getLoadedModule(mods, './helpers:import').loadMetrikaScript).toBe('function')
    expect(typeof getLoadedModule(mods, './helpers:import').createMetrika).toBe('function')
    expect(typeof getLoadedModule(mods, './helpers:import').startTracking).toBe('function')
    expect(typeof getLoadedModule(mods, './helpers:require').loadMetrikaScript).toBe('function')
  })

  it('has expected package metadata', () => {
    expect(pkg.version).toBe('2.0.0')
    expect(pkg.main).toBe('dist/vue2.cjs')
    expect(pkg.exports['./vue3']).toBeTruthy()
  })

  it('ships only flat entry files without hashed chunks', () => {
    const distFiles = readdirSync(join(packageRoot, 'dist'))
    const unexpected = distFiles.filter((file) => /-[A-Za-z0-9]{8,}\.(cjs|mjs)$/.test(file))
    expect(unexpected).toEqual([])
    for (const entry of ['vue2', 'vue3', 'helpers']) {
      expect(distFiles).toContain(`${entry}.cjs`)
      expect(distFiles).toContain(`${entry}.mjs`)
      expect(distFiles).toContain(`${entry}.d.ts`)
      expect(distFiles).toContain(`${entry}.d.cts`)
    }
  })
})
