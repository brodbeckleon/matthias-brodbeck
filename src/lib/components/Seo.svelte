<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { baseLocale, deLocalizeHref, getLocale, locales } from '$lib/paraglide/runtime';
	import { toBcp47, toOgLocale } from '$lib/i18n/format';
	import { absoluteUrl } from '$lib/seo/url';
	import { SITE_URL } from '$lib/site';

	type Props = {
		/** Page name; omitted on the home page. */
		title?: string;
		description: string;
		noindex?: boolean;
	};

	let { title, description, noindex = false }: Props = $props();

	const locale = getLocale();
	const fullTitle = $derived(
		title ? `${title} – Matthias Brodbeck` : `Matthias Brodbeck – ${m.role()}`
	);
	const path = $derived(deLocalizeHref(page.url.pathname));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{:else}
		<link rel="canonical" href={absoluteUrl(path, locale)} />
		{#each locales as alternate (alternate)}
			<link rel="alternate" hreflang={toBcp47(alternate)} href={absoluteUrl(path, alternate)} />
		{/each}
		<link rel="alternate" hreflang="x-default" href={absoluteUrl(path, baseLocale)} />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Matthias Brodbeck" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={absoluteUrl(path, locale)} />
	<meta property="og:locale" content={toOgLocale(locale)} />
	<meta property="og:image" content="{SITE_URL}/og-default.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
