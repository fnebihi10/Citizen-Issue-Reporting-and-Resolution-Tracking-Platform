import { expect, test } from '@playwright/test';

const viewports = [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`landing and login fit ${viewport.width}x${viewport.height} @responsive`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const path of ['/', '/login']) {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }

    if (viewport.width < 768) {
      await page.goto('/');
      const menu = page.getByText('Hap ose mbyll menynë');
      const box = await menu.locator('..').boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
}
