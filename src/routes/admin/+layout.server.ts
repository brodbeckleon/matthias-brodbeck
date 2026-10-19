import { countUnread, purgeOldMessages } from '$lib/server/messages';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.admin) return { loggedIn: false, unread: 0 };
	await purgeOldMessages();
	return { loggedIn: true, unread: await countUnread() };
};
