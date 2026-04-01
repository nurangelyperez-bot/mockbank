import { test, expect } from '@playwright/test';

test('CP-AUT-24 Límite de tarjeta virtual por cuenta', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('demo');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('demo123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  console.log('Paso 2: Ir a sección Tarjeta Virtual');
  await page.getByText('Tarjeta Virtual', { exact: true }).click();

  console.log('Paso 3: Crear primera tarjeta vinculada a Caja de Ahorro');
  await page.getByLabel('Sincronizar con cuenta:').selectOption('ACC002');
  await page.getByRole('button', { name: '+ Generar Nueva Tarjeta' }).click();
  await expect(page.locator('#toast-container')).toBeVisible();
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 4: Intentar crear segunda tarjeta en la misma cuenta');
  await page.getByLabel('Sincronizar con cuenta:').selectOption('ACC002');
  await page.getByRole('button', { name: '+ Generar Nueva Tarjeta' }).click();

  console.log('Paso 5: Validar mensaje de error');
  const toast = page.locator('#toast-container');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Esta cuenta ya posee una tarjeta virtual activa.');

  console.log('✅ Test completado: Límite de tarjeta virtual por cuenta');
});