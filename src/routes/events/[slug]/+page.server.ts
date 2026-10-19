import { error } from '@sveltejs/kit';
import { getPublicEvent } from '$lib/server/events';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const event = await getPublicEvent(params.slug);
	if (!event) error(404);
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400' });
	return { event };
};
