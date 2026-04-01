import { test, expect } from '@playwright/test';

test('CP-AUT-25 Crear, eliminar y recrear tarjeta virtual', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('demo');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('demo123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  console.log('Paso 2: Ir a sección Tarjeta Virtual');
  await page.getByText('Tarjeta Virtual', { exact: true }).click();

  console.log('Paso 3: Crear tarjeta vinculada a Caja de Ahorro');
  await page.getByLabel('Sincronizar con cuenta:').selectOption('ACC002');
  await page.getByRole('button', { name: '+ Generar Nueva Tarjeta' }).click();

  console.log('Paso 4: Validar que la tarjeta se creó exitosamente');
  const toast = page.locator('#toast-container');
  await expect(toast).toContainText('Tarjeta virtual generada');
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 5: Click en botón Eliminar');
  await page.getByRole('button', { name: '🗑️ Eliminar' }).click(); // ⬅️ este faltaba

  console.log('Paso 6: Confirmar eliminación en modal');
  await page.getByRole('button', { name: 'Confirmar' }).click();

  console.log('Paso 7: Validar que la tarjeta se eliminó');
  await expect(toast).toContainText('Tarjeta virtual eliminada');
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 8: Recrear tarjeta en la misma cuenta');
  await page.getByLabel('Sincronizar con cuenta:').selectOption('ACC002');
  await page.getByRole('button', { name: '+ Generar Nueva Tarjeta' }).click();

  console.log('Paso 9: Validar que la nueva tarjeta se creó exitosamente');
  await expect(toast).toContainText('Tarjeta virtual generada');
  await page.waitForSelector('#toast-container', { state: 'hidden' });

  console.log('Paso 10: Validar que la tarjeta aparece activa en pantalla');
  await expect(page.getByText('ACTIVA - VINCULADA A')).toBeVisible();

  console.log('✅ Test completado: Crear, eliminar y recrear tarjeta virtual');
});