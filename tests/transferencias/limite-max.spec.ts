import { test, expect } from '@playwright/test';

test('CP-AUT-16 Validación límite por operación', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Transferencias');
  await page.click('li.menu-item:has-text("Transferencias")');

  console.log('Paso 3: Seleccionar tipo de transferencia');
  await page.selectOption('#transfer-type', { value: 'own' });

  console.log('Paso 4: Seleccionar cuentas');
  await page.selectOption('#source-account', { value: 'ACC001' });
  await page.selectOption('#destination-own-account', { value: 'ACC002' });

  console.log('Paso 5: Ingresar monto superior al límite');
  await page.fill('#transfer-amount', '50001');
  await page.fill('#transfer-description', 'Prueba de límite');

   console.log('Paso 6: Click en Transferir');
  await page.click('button:has-text("TRANSFERIR")');

   console.log('Paso 7: Confirmar en modal');
  await expect(page.locator('text=Confirmar Transferencia')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 8: Validar mensaje de error');
  const errorMsg = page.locator('#transfer-error');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toHaveText('El monto máximo por transferencia es $50.000');

  console.log('✅ Test completado: Validación de límite por operación');
});

