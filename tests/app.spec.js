const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

test('published app opens and capture a clean desktop screenshot', async ({ page }, testInfo) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  expect(response, 'The app should return an HTTP response').not.toBeNull();
  expect(response.status(), 'The published app should respond successfully').toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
  fs.mkdirSync('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/app-desktop.png', fullPage: true });
});

test('published app opens at a mobile-sized viewport and capture screenshot', async ({ page }, testInfo) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  expect(response, 'The app should return an HTTP response').not.toBeNull();
  expect(response.status(), 'The published app should respond successfully').toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
  fs.mkdirSync('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/app-mobile.png', fullPage: true });
});
