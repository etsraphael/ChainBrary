import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    }
  },
  video: false,
  screenshotOnRunFailure: false,
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: '**/*.cy.ts'
  }
});
