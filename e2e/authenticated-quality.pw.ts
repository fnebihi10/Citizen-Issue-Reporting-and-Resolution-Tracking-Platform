import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const syntheticDataEnabled = process.env.E2E_SYNTHETIC_DATA === '1';
const sharedPassword = process.env.E2E_SYNTHETIC_PASSWORD;

type SyntheticRole = 'citizen' | 'official' | 'admin';

const roleConfiguration: Record<
  SyntheticRole,
  { email: string | undefined; landing: string }
> = {
  citizen: {
    email: process.env.E2E_CITIZEN_EMAIL,
    landing: '/citizen',
  },
  official: {
    email: process.env.E2E_OFFICIAL_EMAIL,
    landing: '/official',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL,
    landing: '/admin',
  },
};

async function signIn(page: Page, role: SyntheticRole) {
  const configuration = roleConfiguration[role];
  if (!configuration.email || !sharedPassword) {
    throw new Error(`Missing synthetic ${role} credentials.`);
  }

  await page.goto('/login');
  await page.locator('#email').fill(configuration.email);
  await page.locator('#password').fill(sharedPassword);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`${configuration.landing}$`));
}

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className,
          text: (element.textContent ?? '').trim().slice(0, 100),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter(
        (element) =>
          element.width > 0
          && (element.right > clientWidth + 1 || element.left < -1),
      )
      .slice(0, 10);

    return { clientWidth, scrollWidth, offenders };
  });

  expect(
    dimensions.scrollWidth,
    `Horizontal overflow elements: ${JSON.stringify(dimensions.offenders)}`,
  ).toBe(dimensions.clientWidth);
}

async function auditRoute(page: Page, route: string, privateCache = false) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  if (!response) throw new Error(`Navigation to ${route} returned no response.`);
  expect(response.status()).toBe(200);
  if (privateCache) {
    const cacheControl = response.headers()['cache-control'] ?? '';
    expect(cacheControl).toContain('private');
    expect(cacheControl).toContain('no-store');
  }
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
  return response;
}

test.describe('synthetic-data quality regression', () => {
  test.skip(
    !syntheticDataEnabled,
    'An isolated seeded Supabase environment is required.',
  );

  test('public map and report details are private, responsive, and WCAG AA clean @a11y @responsive', async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/map', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'Dendësia' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page);

    const publicReportId = '10000000-0000-4000-8000-000000000002';
    const privateReportId = '10000000-0000-4000-8000-000000000001';
    const unknownReportId = '20000000-0000-4000-8000-999999999999';

    await auditRoute(page, `/reports/${publicReportId}`);

    await page.goto(`/reports/${privateReportId}`);
    const privateHeading = await page
      .getByRole('heading', { level: 1 })
      .textContent();
    await page.goto(`/reports/${unknownReportId}`);
    const unknownHeading = await page
      .getByRole('heading', { level: 1 })
      .textContent();
    expect(privateHeading).toBe(unknownHeading);
  });

  test('citizen workspace and report detail are responsive and WCAG AA clean @a11y @responsive', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, 'citizen');

    for (const route of [
      '/citizen',
      '/citizen/report',
      '/citizen/reports',
      '/notifications',
      '/account',
    ]) {
      await auditRoute(page, route, true);
    }

    await page.goto('/citizen/reports');
    const detailHref = await page
      .locator('a[href^="/citizen/reports/"]')
      .first()
      .getAttribute('href');
    expect(detailHref).toBeTruthy();
    await auditRoute(page, detailHref!, true);
  });

  test('official workspace and report detail are responsive and WCAG AA clean @a11y @responsive', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, 'official');

    for (const route of [
      '/official',
      '/official/reports',
      '/notifications',
      '/account',
    ]) {
      await auditRoute(page, route, true);
    }

    await page.goto('/official/reports');
    const detailHref = await page
      .locator('a[href^="/official/reports/"]')
      .first()
      .getAttribute('href');
    expect(detailHref).toBeTruthy();
    await auditRoute(page, detailHref!, true);
  });

  test('admin workspace is responsive, private, and WCAG AA clean @a11y @responsive', async ({
    page,
  }) => {
    test.setTimeout(150_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, 'admin');

    for (const route of [
      '/admin',
      '/admin/sla',
      '/admin/analytics',
      '/admin/users',
      '/admin/structure',
      '/admin/audit',
      '/admin/exports',
      '/account',
    ]) {
      await auditRoute(page, route, true);
    }

    const inProgressReportId = '10000000-0000-4000-8000-000000000024';
    await auditRoute(
      page,
      `/official/reports/${inProgressReportId}`,
      true,
    );
    await expect(
      page.getByRole('heading', { name: 'Ngarko provën e zgjidhjes' }),
    ).toBeVisible();
  });
});
