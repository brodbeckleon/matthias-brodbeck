import { expect, test, type Page } from '@playwright/test';

// Shares the database with the other e2e files; runs after contact.test.ts.

async function login(page: Page) {
	await page.goto('/admin/login');
	await page.getByLabel('Passwort').fill('e2e-test-password');
	await page.getByRole('button', { name: 'Anmelden' }).click();
}

test('uploads are rejected without a session', async ({ request, baseURL }) => {
	const response = await request.post('/admin/api/upload', {
		multipart: { width: '10', height: '10' },
		headers: { origin: baseURL! },
		maxRedirects: 0
	});
	expect(response.status()).toBe(303);
});

test('files that are not WebP or JPEG are refused', async ({ page, baseURL }) => {
	await login(page);
	const response = await page.request.post('/admin/api/upload', {
		multipart: {
			file: {
				name: 'evil.webp',
				mimeType: 'image/webp',
				buffer: Buffer.from(
					'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
				)
			},
			width: '10',
			height: '10'
		},
		headers: { origin: baseURL! }
	});
	expect(response.status()).toBe(415);
});

test('a photo is uploaded, described, published and used as the portrait', async ({ page }) => {
	await login(page);
	await page.goto('/admin/photos');
	await page.locator('#files').setInputFiles('static/og-default.png');
	await expect(page.locator('.progress li')).toHaveText(/og-default\.png:\s*fertig/);
	await expect(page.getByText('Beschreibung fehlt')).toBeVisible();

	// The stored file is a re-encoded WebP, not the uploaded PNG.
	const src = await page.locator('.grid img').first().getAttribute('src');
	expect(src).toMatch(/^\/uploads\/photos\/\d{4}\/[0-9a-f-]+\.webp$/);
	const file = await page.request.get(src!);
	expect(file.headers()['content-type']).toBe('image/webp');

	await page.getByRole('link', { name: 'Bearbeiten' }).first().click();
	await page.getByLabel('In der Galerie zeigen').check();
	await page.getByRole('button', { name: 'Speichern' }).click();
	await expect(page.getByRole('alert')).toContainText('deutsche Bildbeschreibung');

	await page.getByLabel('Bildbeschreibung Deutsch *').fill('Matthias Brodbeck am Schlagzeug');
	await page.getByLabel('Bildbeschreibung Englisch').fill('Matthias Brodbeck at the drums');
	await page.getByLabel('Foto von').fill('Anna Muster');
	await page.getByLabel('In der Galerie zeigen').check();
	await page.getByRole('button', { name: 'Speichern' }).click();
	await expect(page).toHaveURL(/\/admin\/photos$/);

	await page.getByRole('link', { name: 'Bearbeiten' }).first().click();
	await page.getByRole('button', { name: 'Als Porträt auf der Startseite' }).click();
	await expect(
		page.getByRole('button', { name: 'Nicht mehr als Porträt verwenden' })
	).toBeVisible();

	await page.goto('/');
	await expect(page.getByRole('img', { name: 'Matthias Brodbeck at the drums' })).toBeVisible();

	// Japanese has no description of its own and falls back to English, marked as such.
	await page.goto('/ja/gallery');
	await expect(page.locator('img[lang="en"][alt="Matthias Brodbeck at the drums"]')).toBeVisible();

	await page.goto('/gallery');
	await page.getByRole('button', { name: 'Matthias Brodbeck at the drums' }).click();
	const lightbox = page.getByRole('dialog', { name: 'Photo 1 of 1' });
	await expect(lightbox).toBeVisible();
	await expect(lightbox.getByText('Photo: Anna Muster')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(lightbox).toBeHidden();
});

test('deleting a photo removes the file', async ({ page }) => {
	await login(page);
	await page.goto('/admin/photos');
	const src = await page.locator('.grid img').first().getAttribute('src');
	await page.getByRole('link', { name: 'Bearbeiten' }).first().click();
	await page.getByRole('button', { name: 'Foto löschen' }).click();
	await expect(page.getByText('Noch keine Fotos.')).toBeVisible();
	expect((await page.request.get(src!)).status()).toBe(404);

	await page.goto('/');
	await expect(page.getByRole('img', { name: 'Portrait coming soon' })).toBeVisible();
});
