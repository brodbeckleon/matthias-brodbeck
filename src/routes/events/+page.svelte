<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
</script>

<Seo title={m.concerts()} description={m.concerts_description()} />

<header class="page-intro">
	<h1>{m.concerts()}</h1>
</header>

<!-- Concerts come from the database once the admin area exists (P4). -->
<EmptyState title={m.concerts_empty_title()} text={m.concerts_empty_text()}>
	<Button href={localizePath('/contact')}>{m.cta_booking()}</Button>
</EmptyState>
