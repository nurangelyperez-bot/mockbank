import { test, expect } from '@playwright/test';

test('CP-AUT-09 Solicitud de préstamo exitosa', async ({ page }) => {
  console.log('Paso 1: Ir a la página de login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  console.log('Paso 2: Llenar usuario y contraseña válidos');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  console.log('Paso 3: Hacer clic en ingresar');
  await page.click('button[type="submit"]');

  console.log('Paso 4: Ir a la sección de Préstamos');
 await page.click('li.menu-item:has-text("Préstamos")');

  console.log('Paso 5: Completar formulario de Solicitar Nuevo Préstamo');
  // Seleccionar cuenta destino (Caja de Ahorro)
  await page.selectOption('#loan-destination-account', { label: 'Caja de Ahorro **** **** **** 5678' });

  // Ingresar monto
  await page.fill('#loan-amount', '50000');

  // Seleccionar cuotas
  await page.selectOption('#loan-installments', { label: '12 cuotas' });

  // Solicitar préstamo
  await page.click('button:has-text("Solicitar Préstamo")');

  console.log('Paso 6: Confirmar préstamo en modal');
  await expect(page.locator('text=Confirmar Préstamo')).toBeVisible();
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 7: Validar en Mis Préstamos Activos');
const prestamosActivos = page.locator('section:has-text("Mis Préstamos Activos")');
await expect(prestamosActivos).toContainText('$ 50.000,00');
await expect(prestamosActivos).toContainText('12 cuotas');

console.log('✔ Préstamo de $50.000 a 12 cuotas registrado correctamente en Mis Préstamos Activos');
console.log('✅ Test completado: Solicitud de préstamo exitosa');
});
