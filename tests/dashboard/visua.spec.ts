import { test, expect } from '@playwright/test';

test('CP-AUT-06	Visualización de productos', async ({ page }) => {
  // Paso 1: ir a la página de login
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  // Paso 2: llenar usuario y contraseña
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  // Paso 3: hacer clic en el botón de ingresar
  await page.click('button[type="submit"]');

 // Paso 4: validaciones
// Validamos que se muestran las 3 tarjetas: CC, CA, TC
await expect(page.locator('.account-type:has-text("Cuenta Corriente")')).toBeVisible();
await expect(page.locator('.account-type:has-text("Caja de Ahorro")')).toBeVisible();
await expect(page.locator('.account-type:has-text("Tarjeta de Crédito")')).toBeVisible();

//Paso 5: salir
await page.click('button:has-text("Salir")');
await expect(page.locator('button:has-text("CONFIRMAR")')).toBeVisible();
await page.locator('button:has-text("CONFIRMAR")').click();
});