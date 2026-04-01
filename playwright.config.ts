import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,            // ⬅️ un test a la vez
  timeout: 60000,        // ⬅️ 60s por test completo
  reporter: [['list']],
  use: {
    headless: false,
    actionTimeout: 30000, // ⬅️ 30s por cada acción (click, fill, etc)
  },
});