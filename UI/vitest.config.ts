import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  define: {},
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'src/environments/*'],
  },
})
