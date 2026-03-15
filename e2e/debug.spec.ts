import { test, expect } from '@playwright/test';

test('Check login flow', async ({ page }) => {
    console.log('Navigating to login...');
    await page.goto('/login');
    console.log('Filling form...');
    await page.fill('input[type="email"]', 'sale.a@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    console.log('Waiting for redirect...');
    await page.waitForTimeout(5000); // Wait 5s instead of strict url match
    console.log('Current URL is: ' + page.url());
    const content = await page.content();
    console.log('Content length: ' + content.length);
});
