import { listGallery } from '$lib/server/media';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400' });
	return { photos: await listGallery() };
};
