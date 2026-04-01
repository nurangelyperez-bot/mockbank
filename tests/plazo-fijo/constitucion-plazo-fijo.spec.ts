import { test, expect } from '@playwright/test';

test('CP-AUT-19 Constitución de plazo fijo válido', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Plazo Fijo');
  await page.click('li.menu-item:has-text("Plazos Fijos")');

 console.log('Paso 3: Completar formulario de plazo fijo');

// Seleccionar cuenta origen
await page.waitForSelector('#deposit-source-account', { state: 'visible', timeout: 10000 });
await page.selectOption('#deposit-source-account', { value: 'ACC001' });

// Ingresar monto válido en "Monto a invertir"
await page.waitForSelector('#deposit-amount', { state: 'visible', timeout: 10000 });
await page.fill('#deposit-amount', '10000');

// Seleccionar plazo (ejemplo: 90 días)
await page.waitForSelector('#deposit-term', { state: 'visible', timeout: 10000 });
await page.selectOption('#deposit-term', { value: '90' });

  console.log('Paso 4: Crear plazo fijo');
  await page.click('button:has-text("CREAR PLAZO FIJO")');

  console.log('Paso 5: Confirmar en modal');
  await page.waitForSelector('text=Confirmar Plazo Fijo', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("CONFIRMAR")');

  console.log('Paso 6: Validar mensaje de éxito');
  const successMsg = page.locator('.toast-message');
  await expect(successMsg).toBeVisible({ timeout: 10000 });
  const textoExito = await successMsg.textContent();
  console.log(`🟩 Mensaje mostrado en la página: ${textoExito}`);

  console.log('✅ Test completado: Constitución de plazo fijo válido');
});
