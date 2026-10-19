import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
	'/',
	'/events',
	'/music',
	'/gallery',
	'/about',
	'/teaching',
	'/contact',
	'/impressum',
	'/privacy'
];
const locales = [
	{ prefix: '', lang: 'en' },
	{ prefix: '/de-ch', lang: 'de-ch' },
	{ prefix: '/ja', lang: 'ja' }
];

for (const { prefix, lang } of locales) {
	for (const route of routes) {
		const path = route === '/' ? prefix || '/' : `${prefix}${route}`;

		test(`${path} renders and passes axe`, async ({ page }) => {
			const response = await page.goto(path);
			expect(response?.status()).toBe(200);
			await expect(page.locator('html')).toHaveAttribute('lang', lang);
			await expect(page.locator('h1')).toHaveCount(1);
			await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
			await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);

			const results = await new AxeBuilder({ page }).analyze();
			expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
		});
	}
}

test('every page has a unique title', async ({ page }) => {
	const titles = new Set<string>();
	for (const route of routes) {
		await page.goto(route);
		titles.add(await page.title());
	}
	expect(titles.size).toBe(routes.length);
});

test('language switcher keeps the current page', async ({ page }) => {
	await page.goto('/about');
	await page.locator('.language summary').click();
	await page.getByRole('link', { name: 'Deutsch' }).click();
	await expect(page).toHaveURL(/\/de-ch\/about$/);
	await expect(page.locator('h1')).toHaveText('Über mich');
});

test('saved light theme is applied before first paint', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('theme', 'light'));
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('theme toggle switches and remembers the theme', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await page.getByRole('button', { name: /light and dark/ }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile menu opens, navigates and closes', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 800 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Menu' }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await dialog.getByRole('link', { name: 'About' }).click();
	await expect(page).toHaveURL(/\/about$/);
	await expect(dialog).toBeHidden();
});

test('unknown pages return 404 with a way back', async ({ page }) => {
	const response = await page.goto('/does-not-exist');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('link', { name: 'Go to the home page' })).toBeVisible();
});

test('the retired /jp prefix is not served', async ({ page }) => {
	const response = await page.goto('/jp/about');
	expect(response?.status()).toBe(404);
});

test.describe('dark theme', () => {
	test.use({ colorScheme: 'dark' });

	for (const route of ['/', '/about', '/contact', '/events', '/does-not-exist']) {
		test(`${route} passes axe in dark mode`, async ({ page }) => {
			await page.goto(route);
			const results = await new AxeBuilder({ page }).analyze();
			expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
		});
	}
});

for (const path of ['/', '/de-ch/about', '/ja/teaching']) {
	test(`${path} does not scroll sideways at 320px`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 700 });
		await page.goto(path);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBe(0);
		await expect(page.getByRole('button', { name: /Menu|Menü|メニュー/ })).toBeInViewport();
	});
}

test('internal links match canonical URLs (no trailing slash)', async ({ page }) => {
	for (const path of ['/de-ch', '/ja/about', '/does-not-exist']) {
		await page.goto(path);
		const hrefs = await page
			.locator('a[href^="/"]')
			.evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
		expect(hrefs.filter((href) => href !== '/' && /\/($|[?#])/.test(href))).toEqual([]);
	}
});

test('closing the mobile menu by navigating does not trap focus on the menu button', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 800 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Menu' }).click();
	await page.getByRole('dialog').getByRole('link', { name: 'Concerts' }).click();
	await expect(page).toHaveURL(/\/events$/);
	const focused = await page.evaluate(() => document.activeElement?.className ?? '');
	expect(focused).not.toContain('menu-button');
});
