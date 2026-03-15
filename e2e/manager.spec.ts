import { test, expect } from '@playwright/test';

test.describe('Phase 3: Manager Workflow', () => {

    test('Manager Account: View Teams, SOS Alerts, and Shadow Sale', async ({ page }) => {
        // 1. Login as Manager
        await page.goto('/login');
        await page.fill('input[type="email"]', 'manager@crmpro.vn');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/manager/);

        // 2. Check Manager Dashboard
        await expect(page.locator('text=Mắt Thần')).toBeVisible({ timeout: 10000 });

        // 3. Navigate to Teams to see Top-down heatmap
        await page.goto('/manager/team');
        // 4. Shadowing Sale
        // Find Sale element and click to view their leads. Assuming there's a link to their shadow page.
        // E.g., href="/manager/shadow/..."
        const shadowLink = page.locator('a[href^="/manager/shadow/"], a[href^="/manager/team/"]').first();
        if (await shadowLink.count() > 0) {
            await shadowLink.click();
            await expect(page).toHaveURL(/.*\/manager\/(shadow|team)\/.*/);
        }

        // 5. Check SOS Alerts
        await page.goto('/manager/sos');
        await expect(page.locator('text=SOS Alerts').first()).toBeVisible({ timeout: 10000 });
    });

});
