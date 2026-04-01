import { test, expect } from '@playwright/test';

test('CP-AUT-01 Login exitoso', async ({ page }) => {
  // Paso 1: ir a la página de login
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  // Paso 2: llenar usuario y contraseña
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  // Paso 3: hacer clic en el botón de ingresar
  await page.click('button[type="submit"]');

 // Paso 4: validaciones
// Validamos que seguimos en la página principal después del login
await expect(page).toHaveURL('https://homebanking-demo-tests.netlify.app/');
// Validamos que aparece el botón "Salir", señal de que el login fue exitoso
await expect(page.locator('button:has-text("Salir")')).toBeVisible();
});