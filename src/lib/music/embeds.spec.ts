import { describe, expect, it } from 'vitest';
import { embedPlatform, parseEmbedUrl, parseYouTubeId } from './embeds';

describe('parseYouTubeId', () => {
	it.each([
		['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42', 'dQw4w9WgXcQ'],
		['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
		['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
		['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
		['https://m.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
		['https://www.youtube.com/live/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
		['dQw4w9WgXcQ', 'dQw4w9WgXcQ']
	])('reads %s', (input, id) => {
		expect(parseYouTubeId(input)).toBe(id);
	});

	it.each(['https://vimeo.com/123', 'https://youtube.com/watch?v=short', 'not a url', ''])(
		'rejects %s',
		(input) => {
			expect(parseYouTubeId(input)).toBeNull();
		}
	);
});

describe('parseEmbedUrl', () => {
	it('takes the src out of a Bandcamp iframe snippet', () => {
		const snippet =
			'<iframe style="border: 0;" src="https://bandcamp.com/EmbeddedPlayer/album=123/size=large/" seamless></iframe>';
		const url = parseEmbedUrl(snippet);
		expect(url).toBe('https://bandcamp.com/EmbeddedPlayer/album=123/size=large/');
		expect(embedPlatform(url!)).toBe('Bandcamp');
	});

	it('accepts a SoundCloud player URL with encoded entities', () => {
		expect(
			parseEmbedUrl(
				'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1&amp;color=ff5500'
			)
		).toBe(
			'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1&color=ff5500'
		);
	});

	it.each([
		'https://evil.example/EmbeddedPlayer/',
		'http://bandcamp.com/EmbeddedPlayer/album=1/',
		'https://bandcamp.com/album/foo',
		'javascript:alert(1)',
		'<iframe src="https://bandcamp.com.evil.example/EmbeddedPlayer/"></iframe>'
	])('rejects %s', (input) => {
		expect(parseEmbedUrl(input)).toBeNull();
	});
});
