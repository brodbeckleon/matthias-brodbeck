import { expect, test, type Page } from '@playwright/test';

async function login(page: Page) {
	await page.goto('/admin/login');
	await page.getByLabel('Passwort').fill('e2e-test-password');
	await page.getByRole('button', { name: 'Anmelden' }).click();
}

test('a non-YouTube address is refused', async ({ page }) => {
	await login(page);
	await page.goto('/admin/music');
	await page.getByLabel('YouTube-Adresse').fill('https://vimeo.com/123');
	await page.getByRole('button', { name: 'Video hinzufügen' }).click();
	await expect(page.getByRole('alert')).toHaveText('Das ist keine YouTube-Adresse.');
});

test('videos and releases appear on the music page, loading nothing external until clicked', async ({
	page
}) => {
	await login(page);
	await page.goto('/admin/music');
	await page.getByLabel('YouTube-Adresse').fill('https://youtu.be/dQw4w9WgXcQ');
	await page.getByLabel('Titel').fill('Saitenschlag live im Moods');
	await page.getByRole('button', { name: 'Video hinzufügen' }).click();
	await expect(page.getByText('Saitenschlag live im Moods')).toBeVisible();

	await page.getByRole('link', { name: 'Neue Aufnahme' }).click();
	await page.getByLabel('Titel *').fill('Saitenschlag');
	await page.getByLabel('Band oder Künstler *').fill('Saitenschlag');
	await page.getByLabel('Jahr').fill('2021');
	await page.getByLabel('Instrumente').fill('drums, percussion');
	await page.getByLabel('Links').fill('Bandcamp | https://saitenschlag.bandcamp.com/album/x');
	await page
		.getByLabel('Player zum Einbetten')
		.fill('<iframe src="https://bandcamp.com/EmbeddedPlayer/album=1/size=small/"></iframe>');
	await page.getByRole('button', { name: 'Aufnahme speichern' }).click();
	await expect(page).toHaveURL(/\/admin\/music$/);

	const external: string[] = [];
	page.on('request', (request) => {
		if (/youtube|ytimg|bandcamp/.test(new URL(request.url()).hostname))
			external.push(request.url());
	});

	await page.goto('/music');
	await expect(page.getByRole('heading', { name: 'Saitenschlag live im Moods' })).toBeVisible();
	await expect(page.getByText('2021')).toBeVisible();
	await expect(page.getByText('drums, percussion')).toBeVisible();
	await expect(page.getByRole('link', { name: /Bandcamp/ })).toHaveAttribute(
		'href',
		'https://saitenschlag.bandcamp.com/album/x'
	);
	expect(external).toEqual([]);

	await page.getByRole('button', { name: 'Play video: Saitenschlag live im Moods' }).click();
	await expect(
		page.locator('iframe[src^="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"]')
	).toBeAttached();

	await page.getByRole('button', { name: 'Load the Bandcamp player' }).click();
	await expect(
		page.locator('iframe[src="https://bandcamp.com/EmbeddedPlayer/album=1/size=small/"]')
	).toBeAttached();
});

test('invalid release links and embeds are explained', async ({ page }) => {
	await login(page);
	await page.goto('/admin/music/releases/new');
	await page.getByLabel('Titel *').fill('X');
	await page.getByLabel('Band oder Künstler *').fill('Y');
	await page.getByLabel('Links').fill('javascript:alert(1)');
	await page
		.getByLabel('Player zum Einbetten')
		.fill('<iframe src="https://evil.example/"></iframe>');
	await page.getByRole('button', { name: 'Aufnahme speichern' }).click();
	await expect(page.getByText(/Jede Zeile braucht eine Adresse/)).toBeVisible();
	await expect(page.getByText(/Nur Player von Bandcamp oder SoundCloud/)).toBeVisible();
});
