const WIDTHS = [480, 828, 1280, 1920] as const;

/** Only Vercel Blob URLs go through Vercel's image optimiser; local uploads are served as-is. */
function isOptimisable(url: string) {
	return /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url);
}

export function imageUrl(url: string, width: number): string {
	if (!isOptimisable(url)) return url;
	return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}

export function imageSrcset(url: string, originalWidth: number): string | undefined {
	if (!isOptimisable(url)) return undefined;
	return WIDTHS.filter((w) => w <= originalWidth || w === WIDTHS[0])
		.map((w) => `${imageUrl(url, w)} ${w}w`)
		.join(', ');
}

export const IMAGE_WIDTHS = WIDTHS;
