import { randomUUID } from 'node:crypto';
import { error, json } from '@sveltejs/kit';
import { assertAdmin } from '$lib/server/auth';
import { sniffImageType } from '$lib/server/image-check';
import { insertMedia } from '$lib/server/media';
import { putFile } from '$lib/server/storage';
import type { RequestHandler } from './$types';

// Vercel functions accept request bodies up to 4.5 MB; resized photos are far below that.
const MAX_BYTES = 4 * 1024 * 1024;
const EXTENSION = { 'image/webp': 'webp', 'image/jpeg': 'jpg' } as const;

export const POST: RequestHandler = async ({ request, locals }) => {
	assertAdmin(locals);

	const data = await request.formData();
	const file = data.get('file');
	const width = Number(data.get('width'));
	const height = Number(data.get('height'));

	if (!(file instanceof Blob)) error(400, 'Keine Datei erhalten.');
	if (file.size > MAX_BYTES) error(413, 'Die Datei ist zu gross (höchstens 4 MB).');
	if (![width, height].every((n) => Number.isInteger(n) && n > 0 && n <= 10000)) {
		error(400, 'Ungültige Bildgrösse.');
	}

	const bytes = await file.arrayBuffer();
	// The declared type is not trusted; only real WebP or JPEG files are stored.
	const type = sniffImageType(new Uint8Array(bytes, 0, Math.min(16, bytes.byteLength)));
	if (!type) error(415, 'Nur WebP- oder JPEG-Bilder sind erlaubt.');

	const year = new Date().getFullYear();
	const stored = await putFile(`photos/${year}/${randomUUID()}.${EXTENSION[type]}`, bytes, type);
	const row = await insertMedia({ url: stored.url, storageKey: stored.key, width, height });

	return json({ id: row.id }, { status: 201 });
};
