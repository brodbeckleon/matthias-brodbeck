<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<Seo title={m.teaching()} description={m.teaching_description()} />

<header class="page-intro">
	<h1>{m.teaching_heading()}</h1>
	<p>{m.teaching_intro()}</p>
</header>

<!-- TODO(content): location, levels, lesson languages and rates once Matthias confirms them. -->
<section class="ask">
	<h2>{m.teaching_ask_heading()}</h2>
	<ul>
		<li>{m.teaching_ask_1()}</li>
		<li>{m.teaching_ask_2()}</li>
		<li>{m.teaching_ask_3()}</li>
	</ul>
	<div>
		<Button href={localizePath('/contact?topic=lessons')}>{m.teaching_cta()}</Button>
	</div>
</section>

<style>
	.ask {
		display: grid;
		gap: var(--space-6);
		max-width: var(--prose-max);
		padding-top: var(--space-12);
		border-top: 1px solid var(--line);
	}

	h2 {
		font-size: var(--text-h3);
	}

	ul {
		display: grid;
		gap: var(--space-3);
		margin: 0;
		padding-left: var(--space-6);
	}

	li::marker {
		color: var(--accent-ink);
	}
</style>
