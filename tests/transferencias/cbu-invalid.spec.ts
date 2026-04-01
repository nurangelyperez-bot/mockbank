import { test, expect, Page } from '@playwright/test';

async function transferirATercero(page: Page, cbu: string, monto: string, descripcion: string): Promise<void> {
  console.log(`➡️ Transferencia a tercero: ${descripcion}`);

  // Seleccionar tipo de transferencia "A terceros"
  await page.selectOption('#transfer-type', { value: 'third-party' });

  // Seleccionar cuenta origen (ej: Cuenta Corriente)
  await page.selectOption('#source-account', { value: 'ACC001' });

  // Ingresar CBU inválido, monto y descripción
  await page.fill('#destination-account-number', cbu);
  await page.fill('#transfer-amount', monto);
  await page.fill('#transfer-description', descripcion);

  // Click en Transferir
  await page.click('button:has-text("TRANSFERIR")');

  // Confirmar modal
  const modal = page.locator('text=Confirmar Transferencia');
  await page.waitForSelector('text=Confirmar Transferencia', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("CONFIRMAR")');
}

test('CP-AUT-19 Validación CBU inválido en transferencia a terceros', async ({ page }) => {
  console.log('Paso 1: Login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  console.log('Paso 2: Ir a sección Transferencias');
  await page.click('li.menu-item:has-text("Transferencias")');

  console.log('Paso 3: Ejecutar transferencia con CBU inválido');
  await transferirATercero(page, '123', '10000', 'Prueba CBU inválido');

  console.log('Paso final: Validar mensaje de error');
  await expect(page.locator('text=CBU o Alias de destino no válido')).toBeVisible({ timeout: 10000 });

  console.log('✅ Test completado: Validación de CBU inválido en transferencia a terceros');
});
