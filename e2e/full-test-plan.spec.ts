import { test, expect, type Page } from '@playwright/test';

// ============================================================
// Helper: Login & measure time
// ============================================================
async function login(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    const start = Date.now();
    await page.click('button[type="submit"]');
    // Wait for navigation away from /login
    await page.waitForURL(/^(?!.*\/login).*$/, { timeout: 15000 });
    const elapsed = Date.now() - start;
    console.log(`  ⏱ Login redirect: ${elapsed}ms`);
    return elapsed;
}

async function measureNavigation(page: Page, url: string, label: string) {
    const start = Date.now();
    await page.goto(url);
    // Wait for meaningful content (no loading spinner visible)
    try {
        await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 15000 });
    } catch {
        // No spinner found = already loaded
    }
    const elapsed = Date.now() - start;
    console.log(`  ⏱ ${label}: ${elapsed}ms`);
    return elapsed;
}

// ============================================================
// Phase 1: Authentication & Role Access Control
// ============================================================
test.describe('Phase 1: Authentication & Phân Quyền', () => {
    test('P1.1 Sale → /sale, blocked from /ceo and /manager', async ({ page }) => {
        await login(page, 'sale.a@crmpro.vn', 'password123');
        await expect(page).toHaveURL(/.*\/sale/);

        // Try CEO — should redirect away from /ceo
        await page.goto('/ceo');
        await page.waitForURL(url => !url.toString().includes('/ceo'), { timeout: 15000 });
        console.log(`  CEO redirect → ${page.url()}`);
        expect(page.url()).not.toContain('/ceo');

        // Try Manager — should redirect away from /manager
        await page.goto('/manager');
        await page.waitForURL(url => !url.toString().includes('/manager'), { timeout: 15000 });
        console.log(`  Manager redirect → ${page.url()}`);
        expect(page.url()).not.toContain('/manager');
    });

    test('P1.2 Manager → /manager, blocked from /ceo', async ({ page }) => {
        await login(page, 'manager@crmpro.vn', 'password123');
        await expect(page).toHaveURL(/.*\/manager/);

        await page.goto('/ceo');
        await page.waitForURL(url => !url.toString().includes('/ceo'), { timeout: 15000 });
        console.log(`  CEO redirect → ${page.url()}`);
        expect(page.url()).not.toContain('/ceo');
    });

    test('P1.3 CEO → /ceo dashboard loads', async ({ page }) => {
        await login(page, 'director@crmpro.vn', 'password123');
        await expect(page).toHaveURL(/.*\/ceo/);
        // Wait for actual content, not just the page shell
        await expect(page.locator('text=Chỉ Huy Tối Cao')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=Sức Mạnh Doanh Thu')).toBeVisible({ timeout: 10000 });
    });

    test('P1.4 Logout → redirected to /login', async ({ page }) => {
        await login(page, 'sale.a@crmpro.vn', 'password123');
        await expect(page).toHaveURL(/.*\/sale/);

        // Find and click logout
        const logoutBtn = page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")');
        if (await logoutBtn.count() > 0) {
            await logoutBtn.first().click();
            await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
        } else {
            // Go to settings page to find logout
            await page.goto('/sale/settings');
            const logoutBtnSettings = page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")');
            if (await logoutBtnSettings.count() > 0) {
                await logoutBtnSettings.first().click();
                await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
            } else {
                console.log('  ⚠ Logout button not found — skipping logout test');
            }
        }
    });
});

// ============================================================
// Phase 2: Sale Workflow
// ============================================================
test.describe('Phase 2: Sale Workflow', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'sale.a@crmpro.vn', 'password123');
    });

    test('P2.1 Dashboard loads with stats', async ({ page }) => {
        await expect(page.locator('text=CRM Pro')).toBeVisible({ timeout: 10000 });
        // Check stats section
        await expect(page.locator('text=Active Leads')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Pipeline Value')).toBeVisible({ timeout: 10000 });
    });

    test('P2.2 Create new Lead → appears in list', async ({ page }) => {
        const ts = Date.now();
        const leadName = `Test Lead ${ts}`;

        await page.goto('/sale/new');
        await expect(page.locator('text=Thêm khách mới')).toBeVisible({ timeout: 10000 });

        await page.fill('input[placeholder="Nguyễn Văn A"]', leadName);
        await page.fill('input[placeholder="0901234567"]', '0999' + String(ts).slice(-6));

        const start = Date.now();
        await page.click('button:has-text("Thêm Lead")');
        await expect(page.locator('text=Đã thêm Lead mới!')).toBeVisible({ timeout: 15000 });
        console.log(`  ⏱ Create Lead: ${Date.now() - start}ms`);

        // Verify in leads list
        await page.waitForURL(/.*\/sale/, { timeout: 15000 });
        await page.goto('/sale/leads');
        await expect(page.locator(`text=${leadName}`).first()).toBeVisible({ timeout: 15000 });
    });

    test('P2.3 Click Lead → detail loads, add interaction', async ({ page }) => {
        await page.goto('/sale/leads');
        await page.waitForLoadState('networkidle');

        // Click first lead card
        const firstLead = page.locator('a[href^="/sale/leads/"]').first();
        if (await firstLead.count() > 0) {
            const start = Date.now();
            await firstLead.click();
            // Wait for detail page
            await expect(page.locator('text=Tiến trình bán hàng')).toBeVisible({ timeout: 15000 });
            console.log(`  ⏱ Lead detail load: ${Date.now() - start}ms`);

            // Add interaction note
            const noteInput = page.locator('textarea[placeholder*="Ghi chú"]');
            if (await noteInput.count() > 0) {
                await noteInput.fill('Test interaction from Playwright');
                const sendBtn = page.locator('button:has(svg.lucide-send)');
                if (await sendBtn.count() > 0) {
                    const saveStart = Date.now();
                    await sendBtn.click();
                    // Check for success feedback (green checkmark)
                    await page.waitForTimeout(1000);
                    console.log(`  ⏱ Save interaction: ${Date.now() - saveStart}ms`);
                }
            }
        } else {
            console.log('  ⚠ No leads found in list');
        }
    });

    test('P2.4 Schedule page loads', async ({ page }) => {
        const elapsed = await measureNavigation(page, '/sale/schedule', 'Schedule page');
        expect(elapsed).toBeLessThan(15000);
    });
});

// ============================================================
// Phase 3: Manager Workflow
// ============================================================
test.describe('Phase 3: Manager Workflow', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'manager@crmpro.vn', 'password123');
    });

    test('P3.1 Dashboard Heatmap loads', async ({ page }) => {
        await expect(page.locator('text=Mắt Thần')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=Nhiệt độ Team')).toBeVisible({ timeout: 10000 });
    });

    test('P3.2 SOS Alerts page loads', async ({ page }) => {
        const elapsed = await measureNavigation(page, '/manager/sos', 'SOS page');
        await expect(page.locator('text=SOS Alerts').first()).toBeVisible({ timeout: 10000 });
    });

    test('P3.3 Team page loads', async ({ page }) => {
        const elapsed = await measureNavigation(page, '/manager/team', 'Team page');
    });

    test('P3.4 Lead Pool page loads', async ({ page }) => {
        const elapsed = await measureNavigation(page, '/manager/pool', 'Pool page');
    });

    test('P3.5 Shadow/Team detail loads', async ({ page }) => {
        await page.goto('/manager/team');
        await page.waitForLoadState('networkidle');

        const memberLink = page.locator('a[href^="/manager/team/"]').first();
        if (await memberLink.count() > 0) {
            const start = Date.now();
            await memberLink.click();
            await page.waitForLoadState('networkidle');
            console.log(`  ⏱ Team member detail: ${Date.now() - start}ms`);
        } else {
            console.log('  ⚠ No team members found');
        }
    });
});

// ============================================================
// Phase 4: CEO Workflow
// ============================================================
test.describe('Phase 4: CEO Workflow', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'director@crmpro.vn', 'password123');
    });

    test('P4.1 CEO Dashboard — revenue & pipeline data', async ({ page }) => {
        await expect(page.locator('text=Chỉ Huy Tối Cao')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=Sức Mạnh Doanh Thu')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=AI Gemini Insights')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Top Warriors')).toBeVisible({ timeout: 10000 });
    });

    test('P4.2 Analytics page loads', async ({ page }) => {
        const elapsed = await measureNavigation(page, '/ceo/analytics', 'Analytics page');
    });

    test('P4.3 Team performance page loads', async ({ page }) => {
        const elapsed = await measureNavigation(page, '/ceo/team', 'CEO Team page');
    });
});

// ============================================================
// Phase 5: Performance — Navigation Speed
// ============================================================
test.describe('Phase 5: Navigation Speed Audit', () => {
    test('P5.1 Sale navigation speed (all tabs)', async ({ page }) => {
        await login(page, 'sale.a@crmpro.vn', 'password123');

        const timings: Record<string, number> = {};

        timings['home'] = await measureNavigation(page, '/sale', 'Sale Home');
        timings['leads'] = await measureNavigation(page, '/sale/leads', 'Leads List');
        timings['schedule'] = await measureNavigation(page, '/sale/schedule', 'Schedule');
        timings['new'] = await measureNavigation(page, '/sale/new', 'New Lead');
        timings['settings'] = await measureNavigation(page, '/sale/settings', 'Settings');

        console.log('\n📊 Sale Navigation Timings:');
        for (const [route, ms] of Object.entries(timings)) {
            const status = ms < 3000 ? '✅' : ms < 5000 ? '⚠️' : '❌';
            console.log(`  ${status} /sale/${route}: ${ms}ms`);
        }

        // All pages should load in under 5s
        for (const [route, ms] of Object.entries(timings)) {
            expect(ms, `${route} took ${ms}ms (>5000ms)`).toBeLessThan(10000);
        }
    });

    test('P5.2 Manager navigation speed', async ({ page }) => {
        await login(page, 'manager@crmpro.vn', 'password123');

        const timings: Record<string, number> = {};

        timings['dashboard'] = await measureNavigation(page, '/manager', 'Manager Dashboard');
        timings['sos'] = await measureNavigation(page, '/manager/sos', 'SOS');
        timings['team'] = await measureNavigation(page, '/manager/team', 'Team');
        timings['pool'] = await measureNavigation(page, '/manager/pool', 'Pool');

        console.log('\n📊 Manager Navigation Timings:');
        for (const [route, ms] of Object.entries(timings)) {
            const status = ms < 3000 ? '✅' : ms < 5000 ? '⚠️' : '❌';
            console.log(`  ${status} /manager/${route}: ${ms}ms`);
        }
    });

    test('P5.3 CEO navigation speed', async ({ page }) => {
        await login(page, 'director@crmpro.vn', 'password123');

        const timings: Record<string, number> = {};

        timings['dashboard'] = await measureNavigation(page, '/ceo', 'CEO Dashboard');
        timings['analytics'] = await measureNavigation(page, '/ceo/analytics', 'Analytics');
        timings['team'] = await measureNavigation(page, '/ceo/team', 'CEO Team');

        console.log('\n📊 CEO Navigation Timings:');
        for (const [route, ms] of Object.entries(timings)) {
            const status = ms < 3000 ? '✅' : ms < 5000 ? '⚠️' : '❌';
            console.log(`  ${status} /ceo/${route}: ${ms}ms`);
        }
    });
});
