import { test, expect } from '@playwright/test';

test.describe('Phase 2 & 3: User Workflow (Sale/Manager)', () => {

    test('Sale Account: Create a Lead', async ({ page }) => {
        // 1. Login as Sale
        await page.goto('/login');
        await page.fill('input[type="email"]', 'sale.a@crmpro.vn');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/sale/);

        // 2. Add Lead
        await page.goto('/sale/new');

        const timestamp = Date.now();
        const leadName = `Shark Hưng ${timestamp}`;

        // Fill form
        // Need to target specific fields correctly (they don't have name attributes, so we try placeholder mapping)
        await page.fill('input[placeholder="Nguyễn Văn A"]', leadName);
        await page.fill('input[placeholder="0901234567"]', '0988111222');
        await page.click('button:has-text("Thêm Lead")');

        // Wait for success screen
        await expect(page.locator('text=Đã thêm Lead mới!')).toBeVisible({ timeout: 10000 });

        // Wait for redirect to /sale
        await expect(page).toHaveURL(/.*\/sale/, { timeout: 15000 });

        // Go to Leads list and look for it
        await page.goto('/sale/leads');
        await expect(page.locator(`text=${leadName}`).first()).toBeVisible({ timeout: 10000 });
    });

});
