<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import Seo from '$lib/components/Seo.svelte';
	import { CONTACT_EMAIL } from '$lib/site';
</script>

<Seo title={m.impressum()} description={m.impressum_description()} />

<header class="page-intro">
	<h1>{m.impressum()}</h1>
</header>

<!-- TODO(content): postal address before launch; Swiss law requires a reachable address. -->
<section class="prose">
	<h2>{m.impressum_responsible()}</h2>
	<p>
		Matthias Brodbeck<br />
		{m.impressum_address_pending()}<br />
		<a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>
	</p>
</section>

<style>
	h2 {
		font-size: var(--text-h3);
	}
</style>
