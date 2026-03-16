import { test, expect } from '@playwright/test';

async function measure(page: any, url: string, name: string) {
    const start = Date.now();
    await page.goto(url);
    try { await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 8000 }); } catch { }
    const ms = Date.now() - start;
    const icon = ms < 200 ? '🟢' : ms < 300 ? '✅' : ms < 500 ? '⚠️' : ms < 1000 ? '🟡' : '❌';
    console.log(`  ${icon} ${name.padEnd(25)} ${ms}ms`);
    return ms;
}

test('Sale Speed', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sale.a@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/sale/, { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('\n❄️  SALE COLD:');
    for (const [u, n] of [['/sale', 'Home'], ['/sale/leads', 'Leads'], ['/sale/schedule', 'Schedule'], ['/sale/new', 'New Lead']])
        await measure(page, u, n);

    console.log('\n🔥 SALE WARM:');
    for (const [u, n] of [['/sale', 'Home'], ['/sale/leads', 'Leads'], ['/sale/schedule', 'Schedule'], ['/sale/new', 'New Lead']])
        await measure(page, u, n);
});

test('Manager Speed', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'manager@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/manager/, { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('\n❄️  MANAGER COLD:');
    for (const [u, n] of [['/manager', 'Dashboard'], ['/manager/sos', 'SOS'], ['/manager/team', 'Team'], ['/manager/pool', 'Pool']])
        await measure(page, u, n);

    console.log('\n🔥 MANAGER WARM:');
    for (const [u, n] of [['/manager', 'Dashboard'], ['/manager/sos', 'SOS'], ['/manager/team', 'Team'], ['/manager/pool', 'Pool']])
        await measure(page, u, n);
});

test('CEO Speed', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'director@crmpro.vn');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/ceo/, { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('\n❄️  CEO COLD:');
    for (const [u, n] of [['/ceo', 'Dashboard'], ['/ceo/team', 'Team']])
        await measure(page, u, n);

    console.log('\n🔥 CEO WARM:');
    for (const [u, n] of [['/ceo', 'Dashboard'], ['/ceo/team', 'Team']])
        await measure(page, u, n);
});
