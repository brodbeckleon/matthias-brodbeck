import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// The inline theme script in app.html is allowed by its hash, computed here so it never goes stale.
const appHtml = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8');
const themeScript = appHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
const themeScriptHash = `sha256-${createHash('sha256').update(themeScript).digest('base64')}`;

const TURNSTILE = 'https://challenges.cloudflare.com';
const BLOB = 'https://*.public.blob.vercel-storage.com';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x',
			// Frankfurt, next to the Neon database in eu-central-1.
			regions: ['fra1'],
			// Must match IMAGE_WIDTHS in src/lib/image.ts.
			images: {
				sizes: [480, 828, 1280, 1920],
				formats: ['image/avif', 'image/webp'],
				minimumCacheTTL: 60 * 60 * 24 * 31,
				domains: [],
				remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }]
			}
		}),
		prerender: {
			// Static pages in each locale; the crawler finds the rest through their links.
			entries: ['*', '/de-ch/about', '/ja/about']
		},
		// Nonces on rendered pages, hashes on prerendered ones (as a <meta> tag).
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', themeScriptHash, TURNSTILE],
				// Svelte's style: directives write style attributes.
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', BLOB],
				'font-src': ['self'],
				'connect-src': ['self', TURNSTILE],
				'frame-src': [
					'https://www.youtube-nocookie.com',
					'https://bandcamp.com',
					'https://w.soundcloud.com',
					TURNSTILE
				],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
