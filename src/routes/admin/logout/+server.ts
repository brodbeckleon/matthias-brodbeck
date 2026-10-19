import { redirect } from '@sveltejs/kit';
import { assertAdmin, invalidateSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	const session = assertAdmin(locals);
	await invalidateSession(cookies, session.id);
	redirect(303, '/admin/login');
};
