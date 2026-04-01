import { test, expect } from '@playwright/test';

test('CP-AUT-04 Logout', async ({ page }) => {
  // Paso 1: ir a la página de login
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  // Paso 2: llenar usuario y contraseña
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  // Paso 3: hacer clic en el botón de ingresar
  await page.click('button[type="submit"]');

// Paso 4: hacer clic en el botón de salir
  await page.click('button:has-text("Salir")');

// Paso 5: hacer clic en el modal confirmar
await expect(page.locator('button:has-text("CONFIRMAR")')).toBeVisible();
await page.locator('button:has-text("CONFIRMAR")').click();

 // Paso 6: validaciones
await expect(page).toHaveURL('https://homebanking-demo-tests.netlify.app/');
await expect(page.locator('button:has-text("Salir")')).not.toBeVisible();
});