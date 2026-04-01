import { test, expect } from '@playwright/test';

test('CP-AUT-03 Bloqueo tras 3 intentos fallidos', async ({ page }) => {
  // Paso 1: ir a la página de login
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  // Paso 2: llenar usuario y contraseña
  await page.fill('input[name="username"]', 'locked');
  await page.fill('input[name="password"]', 'locked');

  // Paso 3: hacer clic en el botón de ingresar
  await page.click('button[type="submit"]');

 // Paso 4: validaciones
await expect(page).toHaveURL('https://homebanking-demo-tests.netlify.app/');
await expect(page.locator('#login-error')).toBeVisible();
await expect(page.locator('#login-error')).toHaveText(/Tu cuenta ha sido bloqueada temporalmente/);
});