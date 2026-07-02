import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export function packageRootFromImportMeta(importMetaUrl: string): string {
  return join(dirname(fileURLToPath(importMetaUrl)), '..', '..')
}

type LoadedModule = Record<string, unknown>

function entryNameFromSubpath(subpath: string): string {
  if (subpath === '.' || subpath === './vue2') {
    return 'vue2'
  }
  if (subpath === './vue3') {
    return 'vue3'
  }
  if (subpath === './helpers') {
    return 'helpers'
  }
  throw new Error(`Unsupported subpath: ${subpath}`)
}

export async function smokeLoadExports(
  packageRoot: string,
  subpath: string,
  formats: Array<'esm' | 'cjs'>,
): Promise<Record<string, LoadedModule>> {
  const result: Record<string, LoadedModule> = {}
  const entryName = entryNameFromSubpath(subpath)

  for (const format of formats) {
    const key = `${subpath}:${format === 'esm' ? 'import' : 'require'}`
    const fileName = `${entryName}.${format === 'esm' ? 'mjs' : 'cjs'}`
    const filePath = join(packageRoot, 'dist', fileName)

    if (format === 'esm') {
      result[key] = await import(pathToFileURL(filePath).href)
      continue
    }

    const require = createRequire(pathToFileURL(join(packageRoot, 'package.json')).href)
    result[key] = require(filePath)
  }

  return result
}

export function getLoadedModule(
  mods: Record<string, LoadedModule>,
  key: string,
): LoadedModule {
  const mod = mods[key]
  if (!mod) {
    throw new Error(`Missing loaded module for key: ${key}`)
  }
  return mod
}
