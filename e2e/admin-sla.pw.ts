import { expect, test } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test('admin SLA is responsive and filterable on mobile and desktop @responsive', async ({
  page,
}) => {
  test.skip(!adminEmail || !adminPassword, 'Synthetic admin credentials are required.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByLabel(/Email/i).fill(adminEmail!);
  await page.getByLabel(/Fjalëkalimi$/i).fill(adminPassword!);
  await page.getByRole('button', { name: 'Hyr në llogari' }).click();
  await expect(page).toHaveURL(/\/admin$/);

  const startedAt = Date.now();
  await page.goto('/admin/sla');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Afatet e shërbimit' }),
  ).toBeVisible();
  const navigationMs = Date.now() - startedAt;

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
  await expect(page.getByLabel('Gjendja e afatit')).toBeVisible();
  await expect(page.getByLabel('Departamenti')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Filtro' })).toBeVisible();
  expect(navigationMs).toBeLessThan(8_000);
  if (process.env.E2E_CAPTURE_PATH) {
    await page.screenshot({ path: process.env.E2E_CAPTURE_PATH });
  }

  await page.getByLabel('Gjendja e afatit').selectOption('due-soon');
  await page.getByRole('button', { name: 'Filtro' }).click();
  await expect(page).toHaveURL(/state=due-soon/);
  await expect(
    page.getByRole('heading', { level: 2, name: 'Afër skadimit' }),
  ).toBeVisible();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/admin/sla');
  const desktopDimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(desktopDimensions.scrollWidth).toBe(desktopDimensions.clientWidth);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Afatet e shërbimit' }),
  ).toBeVisible();
});
