import { test, expect } from '@playwright/test';

test('CP-AUT-26 Validación visual tarjeta virtual', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('demo');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('demo123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  console.log('Paso 2: Ir a sección Tarjeta Virtual');
  await page.getByText('Tarjeta Virtual', { exact: true }).click();

  console.log('Paso 3: Seleccionar cuenta y click en Generar');
  await page.getByLabel('Sincronizar con cuenta:').selectOption('ACC002');
  await page.getByRole('button', { name: '+ Generar Nueva Tarjeta' }).click();

  console.log('Paso 4: Validar que el spinner es visible durante la carga');
  await expect(page.locator('#generate-card-btn .btn-loader')).toBeVisible(); 

  console.log('Paso 5: Esperar que la tarjeta se genere');
  await expect(page.locator('#toast-container')).toContainText('Tarjeta virtual generada');
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 6: Validar que el número de tarjeta tiene 16 dígitos');
  const numeroTarjeta = await page.locator('.card-number-display').textContent();
  const soloDigitos = numeroTarjeta?.replace(/\s/g, '') ?? '';
  expect(soloDigitos).toHaveLength(16);

  console.log('✅ Test completado: Validación visual tarjeta virtual');
});