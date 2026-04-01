import { test, expect } from '@playwright/test';

test('CP-AUT-12 Cancelar préstamo recién creado', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Préstamos');
  await page.click('li.menu-item:has-text("Préstamos")');

  console.log('Paso 3: Crear nuevo préstamo');
  await page.selectOption('#loan-destination-account', { label: 'Caja de Ahorro **** **** **** 5678' });
  await page.fill('#loan-amount', '50000');
  await page.selectOption('#loan-installments', { label: '12 cuotas' });
  await page.click('button:has-text("Solicitar Préstamo")');

  console.log('Paso 4: Confirmar préstamo en modal');
  await expect(page.locator('text=Confirmar Préstamo')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 5: Validar que aparece en Mis Préstamos Activos');
  const prestamosActivos = page.locator('section:has-text("Mis Préstamos Activos")');
  await expect(prestamosActivos).toContainText('$ 50.000,00');
  await expect(prestamosActivos).toContainText('12 cuotas');

  console.log('Paso 6: Cancelar préstamo con Pagar Total');
  const nuevoPrestamo = prestamosActivos.locator('div.deposit-header', { hasText: '$ 50.000,00' });
  await nuevoPrestamo.locator('button:has-text("Pagar Total")').click();

  console.log('Paso 7: Confirmar cancelación en modal');
  await expect(page.locator('text=Cancelar Préstamo')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 8: Validar popup de cancelado');
  const toast = page.locator('#toast-container');
  await expect(toast).toContainText('Préstamo cancelado exitosamente');

  console.log('Paso 9: Validar que el préstamo ya no aparece en activos');
  await expect(prestamosActivos).not.toContainText('$ 50.000,00');

  console.log('✅ Test completado: Cancelación de préstamo recién creado');
});