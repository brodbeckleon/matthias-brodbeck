import { error } from '@sveltejs/kit';
import { readLocalFile, usesBlob } from '$lib/server/storage';
import type { RequestHandler } from './$types';

export const prerender = false;

const TYPES: Record<string, string> = { webp: 'image/webp', jpg: 'image/jpeg' };

/** Serves locally stored uploads in development; production files live on Vercel Blob. */
export const GET: RequestHandler = async ({ params }) => {
	if (usesBlob()) error(404);
	const file = await readLocalFile(params.key);
	const type = TYPES[params.key.split('.').pop() ?? ''];
	if (!file || !type) error(404);
	return new Response(new Uint8Array(file), {
		headers: { 'content-type': type, 'cache-control': 'public, max-age=31536000, immutable' }
	});
};
