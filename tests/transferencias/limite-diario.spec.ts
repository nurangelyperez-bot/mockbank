import { test, expect } from '@playwright/test';

test('CP-AUT-17 Validación límite diario', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Transferencias');
  await page.click('li.menu-item:has-text("Transferencias")');

  // PRIMERA TRANSFERENCIA - $50.000
  console.log('--- PRIMERA TRANSFERENCIA ($50.000) ---');
  await page.selectOption('#transfer-type', { value: 'own' });
  await page.selectOption('#source-account', { value: 'ACC001' });
  await page.selectOption('#destination-own-account', { value: 'ACC002' });
  await page.fill('#transfer-amount', '50000');
  await page.fill('#transfer-description', 'Prueba límite diario 1');
  await page.click('button:has-text("TRANSFERIR")');
  await expect(page.locator('text=Confirmar Transferencia')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');
  await expect(page.locator('#toast-container')).toContainText('Transferencia realizada exitosamente'); // ⬅️ espera éxito
  await page.waitForSelector('#toast-container', { state: 'hidden' }); // ⬅️ espera que desaparezca

  // SEGUNDA TRANSFERENCIA - $40.000
  console.log('--- SEGUNDA TRANSFERENCIA ($40.000) ---');
  await page.selectOption('#transfer-type', { value: 'own' });
  await page.selectOption('#source-account', { value: 'ACC001' });
  await page.selectOption('#destination-own-account', { value: 'ACC002' });
  await page.fill('#transfer-amount', '40000');
  await page.fill('#transfer-description', 'Prueba límite diario 2');
  await page.click('button:has-text("TRANSFERIR")');
  await expect(page.locator('text=Confirmar Transferencia')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');
  await expect(page.locator('#toast-container')).toContainText('Transferencia realizada exitosamente'); // ⬅️ espera éxito
  await page.waitForSelector('#toast-container', { state: 'hidden' }); // ⬅️ espera que desaparezca

  // TERCERA TRANSFERENCIA - $30.000 (debe fallar, acumulado $120.000 > $100.000)
  console.log('--- TERCERA TRANSFERENCIA ($30.000) - Debe fallar ---');
  await page.selectOption('#transfer-type', { value: 'own' });
  await page.selectOption('#source-account', { value: 'ACC001' });
  await page.selectOption('#destination-own-account', { value: 'ACC002' });
  await page.fill('#transfer-amount', '30000');
  await page.fill('#transfer-description', 'Prueba límite diario 3');
  await page.click('button:has-text("TRANSFERIR")');
  await expect(page.locator('text=Confirmar Transferencia')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  // Validar mensaje de error límite diario
  console.log('Paso 8: Validar mensaje de error límite diario');
  const errorMsg = page.locator('#transfer-error');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toHaveText('Has excedido el límite diario de transferencias ($100.000)');

  console.log('✅ Test completado: Validación de límite diario');
});