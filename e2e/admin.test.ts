import { expect, test, type Page } from '@playwright/test';

const PASSWORD = 'e2e-test-password';

async function login(page: Page) {
	await page.goto('/admin/login');
	await page.getByLabel('Passwort').fill(PASSWORD);
	await page.getByRole('button', { name: 'Anmelden' }).click();
	await expect(page).toHaveURL(/\/admin$/);
}

test('the admin area requires a login', async ({ page }) => {
	await page.goto('/admin/events');
	await expect(page).toHaveURL(/\/admin\/login$/);
});

test('form actions are rejected without a session', async ({ request, baseURL }) => {
	const response = await request.post('/admin/events/new?/save', {
		form: { title: 'Sneaky', date: '2030-01-01', startTime: '20:00', venueName: 'X', city: 'Y' },
		headers: { origin: baseURL! },
		maxRedirects: 0
	});
	expect(response.status()).toBe(303);
	expect(response.headers().location).toBe('/admin/login');
});

test('localized admin URLs do not exist', async ({ page }) => {
	const response = await page.goto('/de-ch/admin');
	expect(response?.status()).toBe(404);
});

test('a wrong password is rejected', async ({ page }) => {
	await page.goto('/admin/login');
	await page.getByLabel('Passwort').fill('not the password');
	await page.getByRole('button', { name: 'Anmelden' }).click();
	await expect(page.getByRole('alert')).toContainText('stimmt nicht');
});

test('a concert goes from draft to published', async ({ page }) => {
	await login(page);
	const year = new Date().getFullYear() + 1;

	await page.goto('/admin/events/new');
	await page.getByLabel('Titel *').fill('Saitenschlag im Moods');
	await page.getByLabel('Datum *').fill(`${year}-11-14`);
	await page.getByLabel('Beginn *').fill('20:30');
	await page.getByLabel('Ende').fill('00:30');
	await page.getByLabel('Lokal oder Saal *').fill('Moods');
	await page.getByLabel('Strasse').fill('Schiffbaustrasse 6');
	await page.getByLabel('PLZ').fill('8005');
	await page.getByLabel('Stadt *').fill('Zürich');
	await page.getByLabel('Deutsch').fill('Weltmusik mit vier Saiteninstrumenten und Schlagzeug.');
	await page.getByRole('button', { name: 'Konzert speichern' }).click();

	await expect(page).toHaveURL(/\/admin\/events/);
	await page.getByRole('tab', { name: /Entwürfe/ }).click();
	await expect(page.getByRole('link', { name: 'Saitenschlag im Moods' })).toBeVisible();

	// Drafts are not public.
	const draft = await page.request.get(`/events/${year}-11-14-saitenschlag-im-moods`);
	expect(draft.status()).toBe(404);

	await page.getByRole('tab', { name: /Entwürfe/ }).click();
	await page.getByRole('button', { name: 'Veröffentlichen' }).click();
	await expect(page.getByRole('tab', { name: /Kommend 1/ })).toBeVisible();

	await page.goto('/de-ch/events');
	await page.getByRole('link', { name: 'Saitenschlag im Moods' }).click();
	await expect(page).toHaveURL(new RegExp(`/de-ch/events/${year}-11-14-saitenschlag-im-moods$`));
	await expect(page.locator('h1')).toHaveText('Saitenschlag im Moods');
	await expect(page.getByText('20:30 bis 00:30 Uhr')).toBeVisible();
	await expect(page.getByText('Weltmusik mit vier')).toBeVisible();

	// English has no description of its own, so the German one is shown and marked as German.
	await page.goto(`/events/${year}-11-14-saitenschlag-im-moods`);
	await expect(page.locator('[lang="de-CH"]', { hasText: 'Weltmusik' })).toBeVisible();

	const jsonLd = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}'
	);
	expect(jsonLd['@type']).toBe('MusicEvent');
	expect(jsonLd.startDate).toBe(`${year}-11-14T19:30:00.000Z`);
	expect(jsonLd.endDate).toBe(`${year}-11-14T23:30:00.000Z`);

	const ics = await page.request.get(`/events/${year}-11-14-saitenschlag-im-moods/calendar.ics`);
	expect(ics.headers()['content-type']).toContain('text/calendar');
	expect(await ics.text()).toContain(`DTSTART:${year}1114T193000Z`);

	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Saitenschlag im Moods' })).toBeVisible();
});

test('a deleted concert can be restored', async ({ page }) => {
	await login(page);
	await page.goto('/admin/events');
	await page.getByRole('button', { name: 'Löschen' }).first().click();
	await expect(page.getByText(/wurde gelöscht/)).toBeVisible();
	await page.getByRole('button', { name: 'Rückgängig' }).click();
	await expect(page.getByRole('tab', { name: /Kommend 1/ })).toBeVisible();
});

test('logging out ends the session', async ({ page }) => {
	await login(page);
	await page.getByRole('button', { name: 'Abmelden' }).click();
	await expect(page).toHaveURL(/\/admin\/login$/);
	await page.goto('/admin');
	await expect(page).toHaveURL(/\/admin\/login$/);
});
