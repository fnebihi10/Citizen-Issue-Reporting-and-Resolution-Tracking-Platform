import { expect, test } from '@playwright/test';

test('landing page stays within the navigation performance budget @performance', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const metrics = { cls: 0, longTasks: 0 };
    Object.defineProperty(window, '__qualityMetrics', {
      value: metrics,
      configurable: false,
    });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.entryType === 'layout-shift'
          && !('hadRecentInput' in entry && entry.hadRecentInput)
        ) {
          metrics.cls += 'value' in entry ? Number(entry.value) : 0;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      metrics.longTasks += list.getEntries().length;
    }).observe({ type: 'longtask', buffered: true });
  });

  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response?.status()).toBe(200);
  await page.waitForTimeout(1_000);

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType(
      'resource',
    ) as PerformanceResourceTiming[];
    const quality = (
      window as typeof window & {
        __qualityMetrics: { cls: number; longTasks: number };
      }
    ).__qualityMetrics;
    return {
      domContentLoadedMs: navigation.domContentLoadedEventEnd,
      loadMs: navigation.loadEventEnd,
      resourceCount: resources.length,
      transferBytes: resources.reduce(
        (total, resource) => total + resource.transferSize,
        0,
      ),
      cls: quality.cls,
      longTasks: quality.longTasks,
    };
  });

  expect(metrics.domContentLoadedMs).toBeLessThan(5_000);
  expect(metrics.loadMs).toBeLessThan(8_000);
  expect(metrics.resourceCount).toBeLessThan(100);
  expect(metrics.transferBytes).toBeLessThan(5 * 1024 * 1024);
  expect(metrics.cls).toBeLessThan(0.1);
  expect(metrics.longTasks).toBeLessThan(10);
});
