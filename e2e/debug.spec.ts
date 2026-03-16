import { test, expect } from '@playwright/test';

test('Profile: COLD start — first ever load', async ({ page }) => {
    // Login
    const loginStart = Date.now();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sale.a@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/sale/, { timeout: 15000 });
    console.log(`\n⏱️ Login → Sale: ${Date.now() - loginStart}ms`);

    // Immediately measure cold navigations
    const routes = [
        { url: '/sale', name: 'Sale Home' },
        { url: '/sale/leads', name: 'Leads' },
        { url: '/sale/schedule', name: 'Schedule' },
        { url: '/sale/new', name: 'New Lead' },
    ];

    console.log('\n❄️ COLD CACHE — First visit to each page:');
    for (const route of routes) {
        const start = Date.now();
        await page.goto(route.url);
        try {
            await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 });
        } catch { /* no spinner */ }
        const ms = Date.now() - start;
        const icon = ms < 300 ? '✅' : ms < 500 ? '⚠️' : '❌';
        console.log(`  ${icon} ${route.name}: ${ms}ms`);
    }

    console.log('\n🔥 WARM — Second visit:');
    for (const route of routes) {
        const start = Date.now();
        await page.goto(route.url);
        try {
            await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 });
        } catch { /* no spinner */ }
        const ms = Date.now() - start;
        const icon = ms < 300 ? '✅' : ms < 500 ? '⚠️' : '❌';
        console.log(`  ${icon} ${route.name}: ${ms}ms`);
    }
});

test('Profile: Manager + CEO cold load', async ({ page }) => {
    // Manager
    await page.goto('/login');
    await page.fill('input[type="email"]', 'manager@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/manager/, { timeout: 15000 });

    const mgrRoutes = [
        { url: '/manager', name: 'Manager Dashboard' },
        { url: '/manager/sos', name: 'SOS' },
        { url: '/manager/team', name: 'Team' },
        { url: '/manager/pool', name: 'Pool' },
    ];

    console.log('\n❄️ MANAGER COLD:');
    for (const route of mgrRoutes) {
        const start = Date.now();
        await page.goto(route.url);
        try { await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 }); } catch { }
        const ms = Date.now() - start;
        console.log(`  ${ms < 300 ? '✅' : ms < 500 ? '⚠️' : '❌'} ${route.name}: ${ms}ms`);
    }

    console.log('\n🔥 MANAGER WARM:');
    for (const route of mgrRoutes) {
        const start = Date.now();
        await page.goto(route.url);
        try { await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 }); } catch { }
        const ms = Date.now() - start;
        console.log(`  ${ms < 300 ? '✅' : ms < 500 ? '⚠️' : '❌'} ${route.name}: ${ms}ms`);
    }
});
