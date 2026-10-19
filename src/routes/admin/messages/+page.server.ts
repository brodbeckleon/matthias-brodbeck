import { listMessages, purgeOldMessages } from '$lib/server/messages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	await purgeOldMessages();
	const archived = url.searchParams.get('view') === 'archiv';
	return { archived, messages: await listMessages(archived) };
};
