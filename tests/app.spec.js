const { test, expect } = require('@playwright/test');

test('published app opens and capture a desktop screenshot', async ({ page }, testInfo) => {
  const response = await page.goto('1.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  expect(response, 'The app should return an HTTP response').not.toBeNull();
  expect(response.status(), 'The published app should respond successfully').toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}.png`, fullPage: true });
});

test('published app opens at a mobile-sized viewport and capture screenshot', async ({ page }, testInfo) => {
  const response = await page.goto('1.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  expect(response, 'The app should return an HTTP response').not.toBeNull();
  expect(response.status(), 'The published app should respond successfully').toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}.png`, fullPage: true });
});
