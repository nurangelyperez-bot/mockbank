import { test, expect } from '@playwright/test';

test('CP-AUT-07 Últimos movimientos', async ({ page }) => {
  // Paso 1: ir a la página de login
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  // Paso 2: llenar usuario y contraseña válidos
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  // Paso 3: hacer clic en el botón de ingresar
  await page.click('button[type="submit"]');

  // Paso 4: validaciones de tarjetas
  await expect(page.locator('.account-type:has-text("Cuenta Corriente")')).toBeVisible();
  await expect(page.locator('.account-type:has-text("Caja de Ahorro")')).toBeVisible();
  await expect(page.locator('.account-type:has-text("Tarjeta de Crédito")')).toBeVisible();

  // Paso 5: validaciones de la sección Últimos Movimientos
  const movimientos = page.locator('.transactions-section .transaction-item');
  
  // Validar que la sección existe
  await expect(page.locator('text=Últimos Movimientos')).toBeVisible();

  // Validar que hay 10 transacciones
  await expect(movimientos).toHaveCount(10);

  // Validar que cada transacción tiene descripción, fecha y monto
  for (let i = 0; i < 10; i++) {
    const item = movimientos.nth(i);
    await expect(item.locator('.transaction-description')).toBeVisible();
    await expect(item.locator('.transaction-date')).toBeVisible();
    await expect(item.locator('.transaction-amount')).toBeVisible();
  }

  // Paso 6: salir
  await page.click('button:has-text("Salir")');
  await expect(page.locator('button:has-text("CONFIRMAR")')).toBeVisible();
  await page.locator('button:has-text("CONFIRMAR")').click();
});
