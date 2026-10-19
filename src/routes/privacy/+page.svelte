<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import Seo from '$lib/components/Seo.svelte';

	// TODO(content): name the hosting provider once chosen, and review the text before launch.
	const sections = [
		{ heading: m.privacy_hosting_heading(), text: m.privacy_hosting() },
		{ heading: m.privacy_storage_heading(), text: m.privacy_storage() },
		{ heading: m.privacy_links_heading(), text: m.privacy_links() },
		{ heading: m.privacy_email_heading(), text: m.privacy_email() }
	];
</script>

<Seo title={m.privacy()} description={m.privacy_description()} />

<header class="page-intro">
	<h1>{m.privacy()}</h1>
	<p>{m.privacy_intro()}</p>
</header>

<div class="prose">
	{#each sections as section (section.heading)}
		<section>
			<h2>{section.heading}</h2>
			<p>{section.text}</p>
		</section>
	{/each}
</div>

<style>
	section {
		display: grid;
		gap: var(--space-2);
	}

	h2 {
		font-size: var(--text-h3);
	}
</style>
