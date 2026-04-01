import { test, expect } from '@playwright/test';

test('CP-AUT-13 Desistir préstamo recién creado', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Préstamos');
  await page.click('li.menu-item:has-text("Préstamos")');

  console.log('Paso 3: Crear nuevo préstamo');
  await page.selectOption('#loan-destination-account', { label: 'Caja de Ahorro **** **** **** 5678' });
  await page.fill('#loan-amount', '25000');
  await page.selectOption('#loan-installments', { label: '6 cuotas' });
  await page.click('button:has-text("Solicitar Préstamo")');

  console.log('Paso 4: Confirmar préstamo en modal');
  await expect(page.locator('text=Confirmar Préstamo')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 5: Validar que aparece en Mis Préstamos Activos');
  const prestamosActivos = page.locator('section:has-text("Mis Préstamos Activos")');
  await expect(prestamosActivos).toContainText('$ 25.000,00');
  await expect(prestamosActivos).toContainText('6 cuotas');

  console.log('Paso 6: Verificar que tiene botón DESISTIR');
  const nuevoPrestamo = prestamosActivos.locator('div.deposit-item', { hasText: '$ 25.000,00' });
  await expect(nuevoPrestamo.locator('button:has-text("DESISTIR")')).toBeVisible();

  console.log('Paso 7: Hacer clic en DESISTIR');
  await nuevoPrestamo.locator('button:has-text("DESISTIR")').click();

  console.log('Paso 8: Confirmar desistimiento en modal');
  await expect(page.locator('text=Desistir del Préstamo')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 9: Validar popup de éxito');
  const toast = page.locator('#toast-container');
  await expect(toast).toContainText('Has desistido del préstamo exitosamente');

  console.log('Paso 10: Validar que el préstamo ya no aparece en activos');
  await expect(prestamosActivos).not.toContainText('$ 25.000,00');

  console.log('✅ Test completado: Desistimiento de préstamo exitoso');
});
