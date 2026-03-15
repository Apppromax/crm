import { test, expect } from '@playwright/test';

test.describe('Phase 4: CEO Workflow', () => {

    test('CEO Account: View Dashboard and Strategy Insights', async ({ page }) => {
        // 1. Login as Director/CEO
        await page.goto('/login');
        await page.fill('input[type="email"]', 'director@crmpro.vn');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/ceo/);

        // 2. Dashboard Checks
        await expect(page.locator('text=Chỉ Huy Tối Cao')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Sức Mạnh Doanh Thu')).toBeVisible();
        await expect(page.locator('text=AI Gemini Insights')).toBeVisible();

        // 3. Drill down to Analytics
        await page.goto('/ceo/analytics');
        await expect(page.locator('text=Phân Tích Chiến Lược').first()).toBeVisible({ timeout: 10000 });

        // 4. Team view
        await page.goto('/ceo/team');
        await expect(page.locator('text=Hiệu Suất Đội Ngũ').first()).toBeVisible({ timeout: 10000 });
    });

});
