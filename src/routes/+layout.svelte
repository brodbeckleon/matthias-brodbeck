<script lang="ts">
	import '../global.css';
	// The Latin subset carries every heading; preloading it avoids a late swap of the hero name.
	import archivoLatin from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';

	let { children } = $props();

	// The admin area brings its own shell.
	const isAdmin = $derived(page.route.id?.startsWith('/admin') ?? false);
</script>

<svelte:head>
	<link rel="preload" href={archivoLatin} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{#if isAdmin}
	{@render children()}
{:else}
	<a class="skip-link" href="#main">{m.skip_to_content()}</a>

	<SiteHeader />

	<main id="main" tabindex="-1">
		{@render children()}
	</main>

	<SiteFooter />
{/if}

<style>
	.skip-link {
		position: absolute;
		top: var(--space-2);
		left: var(--space-2);
		z-index: 100;
		padding: var(--space-2) var(--space-4);
		background: var(--accent);
		color: var(--on-accent);
		font-weight: 650;
		transform: translateY(-200%);
	}

	.skip-link:focus {
		transform: none;
	}

	main {
		max-width: var(--content-max);
		margin: 0 auto;
		padding: var(--space-12) var(--gutter) 0;
	}

	main:focus {
		outline: none;
	}
</style>
