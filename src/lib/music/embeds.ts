/** Extracts the 11-character video ID from any common YouTube URL form. */
export function parseYouTubeId(input: string): string | null {
	const text = input.trim();
	if (/^[\w-]{11}$/.test(text)) return text;
	let url: URL;
	try {
		url = new URL(text);
	} catch {
		return null;
	}
	const host = url.hostname.replace(/^(www|m|music)\./, '');
	let id: string | null = null;
	if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
	else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
		id =
			url.searchParams.get('v') ??
			url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/)?.[1] ??
			null;
	}
	return id && /^[\w-]{11}$/.test(id) ? id : null;
}

const EMBED_HOSTS: Record<string, { platform: 'Bandcamp' | 'SoundCloud'; path: RegExp }> = {
	'bandcamp.com': { platform: 'Bandcamp', path: /^\/EmbeddedPlayer\// },
	'w.soundcloud.com': { platform: 'SoundCloud', path: /^\/player\/?$/ }
};

/**
 * Accepts a Bandcamp or SoundCloud player URL, or the whole <iframe> snippet those sites offer,
 * and returns the cleaned player URL. Anything else is rejected.
 */
export function parseEmbedUrl(input: string): string | null {
	const src = input.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] ?? input.trim();
	let url: URL;
	try {
		url = new URL(src.replace(/&amp;/g, '&'));
	} catch {
		return null;
	}
	const host = EMBED_HOSTS[url.hostname];
	if (url.protocol !== 'https:' || !host || !host.path.test(url.pathname)) return null;
	return url.href;
}

export function embedPlatform(embedUrl: string): 'Bandcamp' | 'SoundCloud' | null {
	try {
		return EMBED_HOSTS[new URL(embedUrl).hostname]?.platform ?? null;
	} catch {
		return null;
	}
}
