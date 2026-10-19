<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { socialHref } from '$lib/site';
</script>

<Seo title={m.gallery()} description={m.gallery_description()} />

<header class="page-intro">
	<h1>{m.gallery()}</h1>
</header>

<!-- Photos are uploaded through the admin area (P6). -->
<EmptyState title={m.gallery_empty_title()} text={m.gallery_empty_text()}>
	<Button href={socialHref('Instagram')} target="_blank" rel="noopener noreferrer">
		{m.gallery_empty_cta()}<span class="visually-hidden">{m.opens_new_tab()}</span>
	</Button>
</EmptyState>
