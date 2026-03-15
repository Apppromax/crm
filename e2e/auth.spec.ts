import { test, expect } from '@playwright/test';

test.describe('Phase 1: Authentication & Role Access Control', () => {

    test('Sale Account: Should login to /sale and be blocked from /ceo', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'sale.a@crmpro.vn');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Verify successful login (Expect auto-waits)
        await expect(page).toHaveURL(/.*\/sale/);

        // Try to access CEO dashboard
        await page.goto('/ceo');

        // Should be blocked and redirected to /sale
        await expect(page).toHaveURL(/.*\/sale/);
    });

    test('Manager Account: Should login to /manager and be blocked from /ceo', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'manager@crmpro.vn');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/manager/);

        // Try to access CEO dashboard
        await page.goto('/ceo');

        // Should be blocked
        await expect(page).toHaveURL(/.*\/manager/);
    });

    test('Director Account: Should access /ceo', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'director@crmpro.vn');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/ceo/);
        await expect(page.locator('h1')).toContainText('Chỉ Huy Tối Cao');
    });

});
