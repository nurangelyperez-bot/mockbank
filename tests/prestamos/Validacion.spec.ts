import { test, expect } from '@playwright/test';

test('CP-AUT-10 Validación de monto máximo', async ({ page }) => {
  console.log('Paso 1: Ir a la página de login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  console.log('Paso 2: Llenar usuario y contraseña válidos');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  console.log('Paso 3: Hacer clic en ingresar');
  await page.click('button[type="submit"]');

  console.log('Paso 4: Ir a la sección de Préstamos');
  await page.click('li.menu-item:has-text("Préstamos")');

  console.log('Paso 5: Completar formulario con monto inválido');
  await page.selectOption('#loan-destination-account', { label: 'Caja de Ahorro **** **** **** 5678' });
  await page.fill('#loan-amount', '500001');
  await page.selectOption('#loan-installments', { label: '6 cuotas' });

  console.log('Paso 6: Intentar solicitar préstamo');
  await page.click('button:has-text("Solicitar Préstamo")');

  console.log('Paso 7: Validar mensaje de error');
  const loanInput = page.locator('#loan-amount');

  const isValid = await loanInput.evaluate(el => (el as HTMLInputElement).checkValidity());
  expect(isValid).toBeFalsy();

  const validationMessage = await loanInput.evaluate(el => (el as HTMLInputElement).validationMessage);
  console.log('Mensaje de validación:', validationMessage);

  // Validar que contiene la regla de máximo
  expect(validationMessage).toMatch(/500000/);

  console.log('✔ Se mostró correctamente la validación por monto máximo');
  console.log('✅ Test completado: Validación de monto máximo');
});
