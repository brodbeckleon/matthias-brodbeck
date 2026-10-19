<script lang="ts">
	import { serializeJsonLd } from '$lib/seo/jsonld';

	let { data }: { data: unknown } = $props();

	// Built in script so the closing tag never appears literally in the template.
	const tag = $derived(`<script type="application/ld+json">${serializeJsonLd(data)}</` + `script>`);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serializeJsonLd escapes "<" -->
	{@html tag}
</svelte:head>
