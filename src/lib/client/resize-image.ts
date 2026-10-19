export type ResizedImage = { blob: Blob; width: number; height: number; extension: 'webp' | 'jpg' };

const MAX_EDGE = 2560;

/**
 * Scales a photo down to at most 2560px and re-encodes it. Re-encoding drops EXIF data, including
 * GPS position. Safari cannot encode WebP from a canvas, so JPEG is the fallback.
 */
export async function resizeImage(file: File): Promise<ResizedImage> {
	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	} catch {
		throw new Error(
			'Dieses Bildformat kann der Browser nicht lesen. Bitte als JPEG exportieren und erneut versuchen.'
		);
	}

	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.round(bitmap.width * scale);
	const height = Math.round(bitmap.height * scale);

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();

	const encode = (type: string) =>
		new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));

	const webp = await encode('image/webp');
	if (webp?.type === 'image/webp') return { blob: webp, width, height, extension: 'webp' };

	const jpeg = await encode('image/jpeg');
	if (!jpeg) throw new Error('Das Bild konnte nicht verarbeitet werden.');
	return { blob: jpeg, width, height, extension: 'jpg' };
}
