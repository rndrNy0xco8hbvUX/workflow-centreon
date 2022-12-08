/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import { defineConfig } from 'cypress';

import setupNodeEvents from './cypress/plugins';

export default defineConfig({
  defaultCommandTimeout: 6000,
  e2e: {
    baseUrl: 'http://0.0.0.0:4000',

    excludeSpecPattern: ['*.js', '*.ts', '*.md'],
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents,
    specPattern: 'cypress/e2e/**/*.feature',
  },
  env: {
    dockerName: 'centreon-dev',
  },
  execTimeout: 60000,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/dev/reports/junit-report.xml',
  },
  requestTimeout: 10000,
  retries: 0,
  screenshotsFolder: 'cypress/results/dev/screenshots',
  video: true,
  videosFolder: 'cypress/results/dev/videos',
});