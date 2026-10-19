import { listMessages } from '$lib/server/messages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const archived = url.searchParams.get('view') === 'archiv';
	return { archived, messages: await listMessages(archived) };
};
