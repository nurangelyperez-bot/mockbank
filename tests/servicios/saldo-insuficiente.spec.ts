import { test, expect } from '@playwright/test';

test('CP-AUT-23 Pago de servicio con saldo insuficiente', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('demo');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('demo123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  console.log('Paso 2: Ir a sección Pago de Servicios');
  await page.getByRole('list').getByText('Pago de Servicios').click();

  console.log('Paso 3: Seleccionar servicio Fibertel');
  await page.getByLabel('Selecciona el Servicio').selectOption('SRV004');

  console.log('Paso 4: Ingresar monto superior al saldo de la tarjeta');
  await page.getByRole('spinbutton', { name: 'Monto a Pagar' }).fill('50000');

  console.log('Paso 5: Seleccionar Tarjeta de Crédito (saldo $45.000)');
  await page.getByLabel('Cuenta a Debitar').selectOption('ACC003'); // ⬅️ Tarjeta de Crédito

  console.log('Paso 6: Click en Pagar Servicio');
  await page.getByRole('button', { name: 'Pagar Servicio' }).click();

  console.log('Paso 7: Validar mensaje de saldo insuficiente');
  const toast = page.locator('#toast-container');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Saldo insuficiente');

  console.log('✅ Test completado: Pago con saldo insuficiente');
});