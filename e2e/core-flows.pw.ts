import { expect, test } from '@playwright/test';

test('visitor can understand the service and begin registration @usability', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toContainText('proces i dukshëm');
  await expect(
    page.getByText('Për çështje komunale jo-emergjente.').first(),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Krijo llogari qytetare' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByLabel(/Emri|Emri i plotë/i)).toBeVisible();
  await expect(page.getByLabel(/Email/i)).toBeVisible();
  await expect(page.getByLabel(/Fjalëkalimi$/i)).toBeVisible();
});

test('anonymous visitor is redirected from administration @usability', async ({
  page,
}) => {
  await page.goto('/admin/analytics');

  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fanalytics$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Mirë se u ktheve',
  );
  await expect(page.getByLabel(/Email/i)).toBeVisible();
  await expect(page.getByLabel(/Fjalëkalimi$/i)).toBeVisible();
});

test('keyboard navigation exposes a visible focus indicator @usability', async ({
  page,
}) => {
  await page.goto('/login');
  await page.keyboard.press('Tab');

  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
  const outline = await focused.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  });
  expect(
    outline.outlineStyle !== 'none'
      || outline.outlineWidth !== '0px'
      || outline.boxShadow !== 'none',
  ).toBe(true);
});
