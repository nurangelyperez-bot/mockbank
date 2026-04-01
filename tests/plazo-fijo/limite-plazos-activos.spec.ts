import { test, expect } from '@playwright/test';

test('CP-AUT-21 Límite plazos fijos activos', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('demo');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('demo123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  console.log('Paso 1b: Resetear saldos para volver a 2 plazos fijos activos');
  await page.getByRole('button', { name: 'Restablecer Saldos' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('#toast-container')).toBeVisible();
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 2: Ir a sección Plazo Fijo');
  await page.getByRole('list').getByText('Plazos Fijos').click();

  console.log('Paso 3: Crear 3 plazos fijos válidos (ya hay 2 activos → llegarán a 5)');

  // PF número 1
  console.log('--- PLAZO FIJO 1 ---');
  await page.locator('#deposit-source-account').selectOption('ACC002');
  await page.getByRole('spinbutton', { name: 'Monto a invertir' }).fill('1000');
  await page.getByLabel('Plazo').selectOption('60');
  await page.getByRole('button', { name: 'Crear Plazo Fijo' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('#toast-container')).toBeVisible();
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  // PF número 2
  console.log('--- PLAZO FIJO 2 ---');
  await page.locator('#deposit-source-account').selectOption('ACC002');
  await page.getByRole('spinbutton', { name: 'Monto a invertir' }).fill('1000');
  await page.getByLabel('Plazo').selectOption('60');
  await page.getByRole('button', { name: 'Crear Plazo Fijo' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('#toast-container')).toBeVisible();
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  // PF número 3
  console.log('--- PLAZO FIJO 3 ---');
  await page.locator('#deposit-source-account').selectOption('ACC002');
  await page.getByRole('spinbutton', { name: 'Monto a invertir' }).fill('1000');
  await page.getByLabel('Plazo').selectOption('60');
  await page.getByRole('button', { name: 'Crear Plazo Fijo' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('#toast-container')).toBeVisible();
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 4: Validar que hay 5 plazos fijos activos');
  const activos = page.locator('.active-deposits .deposit-item');
  await expect(activos).toHaveCount(5);

  console.log('Paso 5: Intentar crear el sexto plazo fijo — debe fallar');
  await page.locator('#deposit-source-account').selectOption('ACC002');
  await page.getByRole('spinbutton', { name: 'Monto a invertir' }).fill('2000');
  await page.getByLabel('Plazo').selectOption('90');
  await page.getByRole('button', { name: 'Crear Plazo Fijo' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();

  console.log('Paso 6: Validar mensaje de error por límite');
  const errorMsg = page.locator('text=No puedes tener más de 5 plazos fijos activos');
  await expect(errorMsg).toBeVisible({ timeout: 10000 });
  console.log('🟥 Mensaje de error validado correctamente');

  console.log('✅ Test completado: Límite de plazos fijos activos');
});