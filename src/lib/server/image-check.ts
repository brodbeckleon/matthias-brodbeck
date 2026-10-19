/** Recognises the two formats the admin uploader produces, by their magic bytes. */
export function sniffImageType(bytes: Uint8Array): 'image/webp' | 'image/jpeg' | null {
	if (
		bytes.length > 12 &&
		String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
		String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
	) {
		return 'image/webp';
	}
	if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
		return 'image/jpeg';
	}
	return null;
}
