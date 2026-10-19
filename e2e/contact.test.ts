import { expect, test, type Page } from '@playwright/test';

// Runs after admin.test.ts and shares its database; the rate limit counts per IP across this file.

async function fill(page: Page, name: string, message: string) {
	await page.getByLabel('Name').fill(name);
	await page.getByLabel('Email', { exact: true }).fill('fan@example.com');
	await page.getByLabel('Message').fill(message);
}

async function inbox(page: Page) {
	await page.goto('/admin/login');
	await page.getByLabel('Passwort').fill('e2e-test-password');
	await page.getByRole('button', { name: 'Anmelden' }).click();
	await page.goto('/admin/messages');
}

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('the server reports invalid fields', async ({ page }) => {
		await page.goto('/de-ch/contact');
		await page.getByRole('button', { name: 'Nachricht senden' }).click();
		await expect(page.getByRole('alert')).toHaveText('Bitte prüfen Sie die markierten Felder.');
		await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
		await expect(page.getByText('Bitte geben Sie Ihren Namen ein.')).toBeVisible();
	});
});

test('booking fields appear only for bookings, and ?topic preselects', async ({ page }) => {
	await page.goto('/contact?topic=lessons');
	await expect(page.getByLabel('What is it about?')).toHaveValue('lessons');
	await expect(page.getByLabel('Date of the concert')).toBeHidden();
	await page.getByLabel('What is it about?').selectOption('booking');
	await expect(page.getByLabel('Date of the concert')).toBeVisible();
});

test('a message reaches the inbox as plain text', async ({ page }) => {
	await page.goto('/contact');
	await fill(page, 'Anna Muster', 'Hello <b>not bold</b>, are you free on 14 November?');
	await page.getByLabel('Date of the concert').fill('14.11.');
	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(page.getByRole('status')).toContainText('Message sent');

	await inbox(page);
	await expect(page.getByRole('link', { name: /Nachrichten \(1\)/ })).toBeVisible();
	await page.getByRole('link', { name: /Anna Muster/ }).click();
	await expect(page.getByText('Hello <b>not bold</b>', { exact: false })).toBeVisible();
	await expect(page.locator('.body b')).toHaveCount(0);
	await expect(page.getByText('14.11.')).toBeVisible();
	// Without Resend configured, the failed notification is flagged.
	await expect(page.getByText(/fehlgeschlagen/)).toBeVisible();
});

test('the honeypot fakes success and stores nothing', async ({ page }) => {
	await page.goto('/contact');
	await fill(page, 'Bot', 'Buy now');
	await page.locator('#website').fill('https://spam.example', { force: true });
	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(page.getByRole('status')).toContainText('Message sent');

	await inbox(page);
	await expect(page.getByRole('link', { name: /Bot/ })).toHaveCount(0);
});

test('the sixth message within an hour is rejected', async ({ page }) => {
	// One message was sent above; four more reach the limit of five.
	for (let i = 2; i <= 5; i++) {
		await page.goto('/contact');
		await fill(page, `Sender ${i}`, 'Hello');
		await page.getByRole('button', { name: 'Send message' }).click();
		await expect(page.getByRole('status')).toContainText('Message sent');
	}
	await page.goto('/contact');
	await fill(page, 'Sender 6', 'Hello');
	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(page.getByRole('alert')).toContainText('Too many messages');
	// The visitor's text is kept so it can be copied into an email.
	await expect(page.getByLabel('Message')).toHaveValue('Hello');
});
