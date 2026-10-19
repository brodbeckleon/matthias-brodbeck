const TRANSLITERATION: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };

/** "2026-11-14" + "Saitenschlag im Moods" → "2026-11-14-saitenschlag-im-moods" */
export function eventSlug(date: string, title: string): string {
	const words = title
		.toLowerCase()
		.replace(/[äöüß]/g, (char) => TRANSLITERATION[char])
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60)
		.replace(/-+$/, '');
	return `${date}-${words || 'konzert'}`;
}

/** Appends -2, -3, … until `taken` reports the slug as free. */
export async function uniqueSlug(
	base: string,
	taken: (slug: string) => Promise<boolean>
): Promise<string> {
	let slug = base;
	for (let n = 2; await taken(slug); n++) slug = `${base}-${n}`;
	return slug;
}
