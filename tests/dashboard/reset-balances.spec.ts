import { test, expect } from '@playwright/test';

test('CP-AUT-08 Restablecer saldos', async ({ page }) => {
  console.log('Paso 1: Ir a la página de login');
  await page.goto('https://homebanking-demo-tests.netlify.app/');

  console.log('Paso 2: Llenar usuario y contraseña válidos');
  await page.fill('input[name="username"]', 'demo');
  await page.fill('input[name="password"]', 'demo123');

  console.log('Paso 3: Hacer clic en ingresar');
  await page.click('button[type="submit"]');

  console.log('Paso 4: Capturar saldos iniciales (esperando carga)');
  const saldoCCLocator = page.locator('.account-card:has-text("Cuenta Corriente") .balance-value');
  await expect(saldoCCLocator).toBeVisible();
  const saldoCCInicial = await saldoCCLocator.innerText();

  const saldoCALocator = page.locator('.account-card:has-text("Caja de Ahorro") .balance-value');
  await expect(saldoCALocator).toBeVisible();
  const saldoCAInicial = await saldoCALocator.innerText();

  const saldoTCLocator = page.locator('.account-card:has-text("Tarjeta de Crédito") .balance-value');
  await expect(saldoTCLocator).toBeVisible();
  const saldoTCInicial = await saldoTCLocator.innerText();

  console.log(`Saldo inicial CC: ${saldoCCInicial}`);
  console.log(`Saldo inicial CA: ${saldoCAInicial}`);
  console.log(`Saldo inicial TC: ${saldoTCInicial}`);

  console.log('Paso 5: Hacer clic en Restablecer Saldos y confirmar');
  await page.click('button:has-text("Restablecer Saldos")');
  await expect(page.locator('button:has-text("CONFIRMAR")')).toBeVisible();
  await page.locator('button:has-text("CONFIRMAR")').click();

  console.log('Paso 6: Capturar saldos después de restablecer');
  const saldoCCNuevo = await saldoCCLocator.innerText();
  const saldoCANuevo = await saldoCALocator.innerText();
  const saldoTCNuevo = await saldoTCLocator.innerText();

  console.log(`Saldo nuevo CC: ${saldoCCNuevo}`);
  console.log(`Saldo nuevo CA: ${saldoCANuevo}`);
  console.log(`Saldo nuevo TC: ${saldoTCNuevo}`);

  console.log('Paso 7: Comparaciones');
  console.table([
    { Cuenta: 'CC', Inicial: saldoCCInicial, Nuevo: saldoCCNuevo },
    { Cuenta: 'CA', Inicial: saldoCAInicial, Nuevo: saldoCANuevo },
    { Cuenta: 'TC', Inicial: saldoTCInicial, Nuevo: saldoTCNuevo },
  ]);

  expect(saldoCCNuevo).not.toEqual(saldoCCInicial);
  console.log('✔ CC cambió correctamente');

  expect(saldoCANuevo).not.toEqual(saldoCAInicial);
  console.log('✔ CA cambió correctamente');

  expect(saldoTCNuevo).not.toEqual(saldoTCInicial);
  console.log('✔ TC cambió correctamente');

  console.log('✅ Test completado: Restablecer saldos');
});
