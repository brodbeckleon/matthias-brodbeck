import { listPast, listUpcoming } from '$lib/server/events';
import type { PageServerLoad } from './$types';

// Served from the database; the CDN keeps a copy for a minute so edits show up quickly.
export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	const now = new Date();
	const [upcoming, past] = await Promise.all([listUpcoming(now), listPast(now)]);
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400' });
	return { upcoming, past };
};
