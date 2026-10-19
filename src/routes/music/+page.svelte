<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { socialHref } from '$lib/site';
</script>

<Seo title={m.music()} description={m.music_description()} />

<header class="page-intro">
	<h1>{m.music()}</h1>
</header>

<!-- Videos and releases come from the database once the admin area exists (P7). -->
<EmptyState title={m.music_empty_title()} text={m.music_empty_text()}>
	<Button href={socialHref('YouTube')} target="_blank" rel="noopener noreferrer">
		{m.music_empty_cta()}<span class="visually-hidden">{m.opens_new_tab()}</span>
	</Button>
</EmptyState>
