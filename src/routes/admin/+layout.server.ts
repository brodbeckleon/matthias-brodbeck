import { countUnread } from '$lib/server/messages';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

export const load: LayoutServerLoad = async ({ locals }) => ({
	loggedIn: locals.admin !== null,
	unread: locals.admin ? await countUnread() : 0
});
