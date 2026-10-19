import { redirect } from '@sveltejs/kit';
import { assertAdmin, invalidateAllSessions } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	logoutEverywhere: async ({ locals, cookies }) => {
		assertAdmin(locals);
		await invalidateAllSessions();
		cookies.delete('admin_session', { path: '/admin' });
		redirect(303, '/admin/login');
	}
};
