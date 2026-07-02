// @ts-nocheck
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const jsEntries = ['vue2', 'vue3', 'helpers']

function dualPackageBeforeWriteFile(filePath, content) {
  const base = filePath
    .split('/')
    .pop()
    ?.replace(/\.d\.ts$/, '')
  if (base !== 'vue2' && base !== 'vue3' && base !== 'helpers') {
    return { filePath, content }
  }
  const ctsPath = filePath.replace(/\.d\.ts$/, '.d.cts')
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
  writeFileSync(ctsPath, content)
  return false
}

export default defineConfig(({ mode }) => {
  const entryName = mode
  if (!jsEntries.includes(entryName)) {
    throw new Error(`Unknown build mode "${mode}". Use: ${jsEntries.join(', ')}`)
  }

  return {
    build: {
      emptyOutDir: entryName === 'vue2',
      codeSplitting: false,
      lib: {
        entry: resolve(__dirname, `src/${entryName}.ts`),
        formats: ['es', 'cjs'],
        fileName: (format) => `${entryName}.${format === 'cjs' ? 'cjs' : 'mjs'}`,
      },
      rollupOptions: {
        external: ['vue', 'vue-router', 'vue2'],
        output: {
          exports: 'named',
        },
      },
    },
    plugins: [dts({
      tsconfigPath: 'tsconfig.build.json',
      rollupTypes: true,
      beforeWriteFile: dualPackageBeforeWriteFile,
    })],
  }
})
