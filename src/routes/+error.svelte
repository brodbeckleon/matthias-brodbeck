<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const notFound = $derived(page.status === 404);
</script>

<Seo
	title={notFound ? m.not_found_title() : m.error_title()}
	description={notFound ? m.not_found_text() : m.error_text()}
	noindex
/>

<header class="page-intro">
	<p class="status">{page.status}</p>
	<h1>{notFound ? m.not_found_title() : m.error_title()}</h1>
	<p>{notFound ? m.not_found_text() : m.error_text()}</p>
</header>

<div class="actions">
	<Button href={localizePath('/')}>{m.back_home()}</Button>
	<Button href={localizePath('/events')} variant="secondary">{m.concerts()}</Button>
	<Button href={localizePath('/contact')} variant="secondary">{m.contact()}</Button>
</div>

<style>
	.status {
		color: var(--accent-ink);
		font-size: var(--text-h1);
		font-stretch: var(--stretch-display);
		font-weight: 800;
		line-height: 1;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}
</style>
