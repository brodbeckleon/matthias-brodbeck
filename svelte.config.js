import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto until hosting is decided.
		adapter: adapter(),
		prerender: {
			// Static pages in each locale; the crawler finds the rest through their links.
			entries: ['*', '/de-ch/about', '/ja/about']
		}
	}
};

export default config;
