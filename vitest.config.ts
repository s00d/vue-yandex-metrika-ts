import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      vue2: 'vue2/dist/vue.esm.js',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/publish/**'],
  },
})
