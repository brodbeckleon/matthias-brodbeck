import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createSession } from '$lib/server/auth';
import { verifyPassword } from '$lib/server/password';
import { hashIp, hit, resetLimit } from '$lib/server/rate-limit';
import type { Actions, PageServerLoad } from './$types';

const MINUTE = 60 * 1000;

export const load: PageServerLoad = ({ locals }) => {
	if (locals.admin) redirect(303, '/admin');
	return { configured: Boolean(env.ADMIN_PASSWORD_HASH) };
};

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		if (!env.ADMIN_PASSWORD_HASH) {
			return fail(500, { error: 'Es ist noch kein Passwort eingerichtet (ADMIN_PASSWORD_HASH).' });
		}

		// The attempt is reserved atomically before the password is checked, so parallel requests
		// cannot slip past the limit. A successful login clears the counter again.
		//
		// There is deliberately no global cap: anyone could fill it and lock Matthias out. Against
		// distributed guessing, the password must be long (the hash script enforces 12+ characters).
		const visitorKey = `login:${hashIp(getClientAddress())}`;
		if (!(await hit(visitorKey, 5, 15 * MINUTE))) {
			return fail(429, { error: 'Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.' });
		}

		const password = (await request.formData()).get('password');
		if (
			typeof password !== 'string' ||
			!(await verifyPassword(password, env.ADMIN_PASSWORD_HASH))
		) {
			return fail(400, { error: 'Das Passwort stimmt nicht.' });
		}

		await resetLimit(visitorKey);
		await createSession(cookies);
		redirect(303, '/admin');
	}
};
