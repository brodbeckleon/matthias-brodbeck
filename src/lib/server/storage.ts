import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { del, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';

/**
 * File storage: Vercel Blob in production (BLOB_READ_WRITE_TOKEN), otherwise the local folder
 * UPLOAD_DIR (default .data/uploads) served by /uploads/[...key].
 */
const LOCAL_DIR = () => env.UPLOAD_DIR || '.data/uploads';

export const usesBlob = () => Boolean(env.BLOB_READ_WRITE_TOKEN);

export async function putFile(
	key: string,
	data: ArrayBuffer,
	contentType: string
): Promise<{ url: string; key: string }> {
	if (usesBlob()) {
		const blob = await put(key, Buffer.from(data), {
			access: 'public',
			contentType,
			addRandomSuffix: true,
			cacheControlMaxAge: 60 * 60 * 24 * 365
		});
		return { url: blob.url, key: blob.url };
	}

	const path = localPath(key);
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, Buffer.from(data));
	return { url: `/uploads/${key}`, key };
}

export async function deleteFile(key: string): Promise<void> {
	if (usesBlob()) {
		await del(key);
		return;
	}
	await rm(localPath(key), { force: true });
}

export async function readLocalFile(key: string): Promise<Buffer | null> {
	try {
		return await readFile(localPath(key));
	} catch {
		return null;
	}
}

/** Resolves a key inside the upload folder, refusing anything that escapes it. */
function localPath(key: string): string {
	const root = normalize(LOCAL_DIR());
	const path = normalize(join(root, key));
	if (!path.startsWith(root + '/') || key.includes('\0')) throw new Error('Invalid key');
	return path;
}
