import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x',
			// Frankfurt, next to the Neon database in eu-central-1.
			regions: ['fra1']
		}),
		prerender: {
			// Static pages in each locale; the crawler finds the rest through their links.
			entries: ['*', '/de-ch/about', '/ja/about']
		}
	}
};

export default config;
