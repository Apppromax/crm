import { test, expect } from '@playwright/test';

test('Debug: Check role lookup', async ({ page }) => {
    // Login as Sale
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sale.a@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/sale/, { timeout: 15000 });

    // Call debug API
    const response = await page.goto('/api/debug-role');
    const body = await response?.text();
    console.log('Debug API response:', body);
});
