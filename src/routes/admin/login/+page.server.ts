import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createSession } from '$lib/server/auth';
import { verifyPassword } from '$lib/server/password';
import { hashIp, hit } from '$lib/server/rate-limit';
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

		// Per visitor, plus a global cap so a botnet cannot guess in parallel.
		const allowed =
			(await hit(`login:${hashIp(getClientAddress())}`, 5, 15 * MINUTE)) &&
			(await hit('login:global', 30, 60 * MINUTE));
		if (!allowed) {
			return fail(429, { error: 'Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.' });
		}

		const password = (await request.formData()).get('password');
		if (
			typeof password !== 'string' ||
			!(await verifyPassword(password, env.ADMIN_PASSWORD_HASH))
		) {
			return fail(400, { error: 'Das Passwort stimmt nicht.' });
		}

		await createSession(cookies);
		redirect(303, '/admin');
	}
};
