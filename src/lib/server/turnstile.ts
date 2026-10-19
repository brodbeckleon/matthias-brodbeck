import { env } from '$env/dynamic/private';

/**
 * Verifies a Cloudflare Turnstile token. Without TURNSTILE_SECRET_KEY the check is skipped, so
 * development works offline; the honeypot and rate limit still apply.
 */
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
	if (!env.TURNSTILE_SECRET_KEY) return true;
	if (!token) return false;

	const body = new FormData();
	body.set('secret', env.TURNSTILE_SECRET_KEY);
	body.set('response', token);
	body.set('remoteip', ip);

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body
		});
		const result = (await response.json()) as { success?: boolean };
		return result.success === true;
	} catch {
		return false;
	}
}
