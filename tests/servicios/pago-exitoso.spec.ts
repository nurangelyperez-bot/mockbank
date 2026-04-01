import { test, expect } from '@playwright/test';

test('CP-AUT-22 Pago de servicio exitoso', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('demo');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('demo123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  console.log('Paso 2: Ir a sección Pago de Servicios');
  await page.getByRole('list').getByText('Pago de Servicios').click();

  console.log('Paso 3: Seleccionar servicio Fibertel');
  await page.getByLabel('Selecciona el Servicio').selectOption('SRV004');

  console.log('Paso 4: Verificar que el monto sugerido es $12.000');
  await expect(page.getByRole('spinbutton', { name: 'Monto a Pagar' })).toHaveValue('12000');

  console.log('Paso 5: Seleccionar cuenta a debitar');
  await page.getByLabel('Cuenta a Debitar').selectOption('ACC002');

  console.log('Paso 6: Click en Pagar Servicio');
  await page.getByRole('button', { name: 'Pagar Servicio' }).click();

  console.log('Paso 7: Validar mensaje de éxito');
  await expect(page.getByText('¡Pago Finalizado con éxito!')).toBeVisible();

  console.log('✅ Test completado: Pago de servicio exitoso');
});