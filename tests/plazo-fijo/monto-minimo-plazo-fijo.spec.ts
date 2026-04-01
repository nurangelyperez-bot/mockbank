import { test, expect } from '@playwright/test';

test('CP-AUT-20 Validación monto mínimo en plazo fijo', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Plazo Fijo');
  await page.click('li.menu-item:has-text("Plazos Fijos")');

  console.log('Paso 3: Completar formulario con monto inválido');
  await page.selectOption('#deposit-source-account', { value: 'ACC002' }); // Caja de Ahorro
  await page.fill('#deposit-amount', '999'); // Monto menor al mínimo
  await page.selectOption('#deposit-term', { value: '90' }); // Plazo 90 días

  console.log('Paso 4: Intentar crear plazo fijo');
  await page.click('button:has-text("CREAR PLAZO FIJO")');

  console.log('Paso 5: Validar mensaje de error nativo del input');
  const amountInput = page.locator('#deposit-amount');
  const validationMessage = await amountInput.evaluate((el: HTMLInputElement) => el.validationMessage);

  console.log(`🟥 Mensaje mostrado por el navegador: ${validationMessage}`);
  // Validamos contra el texto exacto que devuelve el navegador
  expect(validationMessage).toBe('El valor debe ser mayor de o igual a 1000');

  console.log('✅ Test completado: Validación monto mínimo en plazo fijo');
});
