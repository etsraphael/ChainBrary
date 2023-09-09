import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.env': {}
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'src/environments/*'],
  },
})
