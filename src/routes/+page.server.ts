import { listUpcoming } from '$lib/server/events';
import type { PageServerLoad } from './$types';

// The next concerts come from the database, so the home page is rendered on request and cached.
export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400' });
	return { nextEvents: await listUpcoming(new Date(), 3) };
};
