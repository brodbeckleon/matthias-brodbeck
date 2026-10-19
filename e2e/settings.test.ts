import { expect, test, type Page } from '@playwright/test';

// Runs after the admin, contact, music and photos files, so every page type has content.

async function login(page: Page) {
	await page.goto('/admin/login');
	await page.getByLabel('Passwort').fill('e2e-test-password');
	await page.getByRole('button', { name: 'Anmelden' }).click();
	await expect(page).toHaveURL(/\/admin$/);
}

test('no page breaks the Content Security Policy', async ({ page }) => {
	const violations: string[] = [];
	page.on('console', (message) => {
		if (/Content Security Policy|Refused to/i.test(message.text())) violations.push(message.text());
	});

	const year = new Date().getFullYear() + 1;
	for (const path of [
		'/',
		'/de-ch/about',
		'/ja/teaching',
		'/events',
		`/de-ch/events/${year}-11-14-saitenschlag-im-moods`,
		'/gallery',
		'/contact',
		'/does-not-exist'
	]) {
		await page.goto(path);
		await page.waitForLoadState('networkidle');
	}

	await page.goto('/music');
	await page.getByRole('button', { name: /Play video/ }).click();
	await page.getByRole('button', { name: /Load the Bandcamp player/ }).click();

	await login(page);
	for (const path of [
		'/admin/events',
		'/admin/events/new',
		'/admin/photos',
		'/admin/music',
		'/admin/messages'
	]) {
		await page.goto(path);
	}

	expect(violations).toEqual([]);
});

test('rendered pages carry security headers', async ({ request }) => {
	const response = await request.get('/events');
	const headers = response.headers();
	expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
	expect(headers['content-security-policy']).toContain("script-src 'self'");
	expect(headers['x-frame-options']).toBe('DENY');
	expect(headers['x-content-type-options']).toBe('nosniff');
	expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
});

test('prerendered pages carry the CSP as a meta tag', async ({ page }) => {
	await page.goto('/about');
	await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute(
		'content',
		/script-src 'self' 'sha256-/
	);
});

test('the sitemap lists published concerts, not the admin area', async ({ request }) => {
	const body = await (await request.get('/sitemap.xml')).text();
	expect(body).toMatch(/\/de-ch\/events\/\d{4}-11-14-saitenschlag-im-moods</);
	expect(body).toContain('hreflang="x-default"');
	expect(body).not.toContain('/admin');
});

test('the export contains the content', async ({ page }) => {
	await login(page);
	const response = await page.request.get('/admin/settings/export.json');
	expect(response.headers()['content-disposition']).toMatch(/attachment; filename="website-/);
	const data = await response.json();
	expect(data.events.length).toBeGreaterThan(0);
	expect(data.videos.length).toBeGreaterThan(0);
	expect(data).not.toHaveProperty('sessions');
});

test('the export requires a login', async ({ request }) => {
	const response = await request.get('/admin/settings/export.json', { maxRedirects: 0 });
	expect(response.status()).toBe(303);
});

test('"log out everywhere" ends every session', async ({ browser }) => {
	const phone = await browser.newPage();
	const laptop = await browser.newPage();
	await login(phone);
	await login(laptop);

	await laptop.goto('/admin/settings');
	await laptop.getByRole('button', { name: 'Überall abmelden' }).click();
	await expect(laptop).toHaveURL(/\/admin\/login$/);

	await phone.goto('/admin/events');
	await expect(phone).toHaveURL(/\/admin\/login$/);
});
