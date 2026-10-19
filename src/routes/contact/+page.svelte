<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import Seo from '$lib/components/Seo.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { CONTACT_EMAIL } from '$lib/site';
</script>

<Seo title={m.contact()} description={m.contact_description()} />

<header class="page-intro">
	<h1>{m.contact_heading()}</h1>
	<p>{m.contact_intro()}</p>
</header>

<!-- A contact form with spam protection replaces the plain address in P5. -->
<div class="channels">
	<section>
		<h2>{m.contact_email()}</h2>
		<a class="email" href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>
	</section>
	<section>
		<h2>{m.contact_elsewhere()}</h2>
		<SocialLinks showLabels />
	</section>
</div>

<style>
	.channels {
		display: grid;
		gap: var(--space-12);
		padding-top: var(--space-12);
		border-top: 1px solid var(--line);
	}

	@media (min-width: 48rem) {
		.channels {
			grid-template-columns: 2fr 1fr;
		}
	}

	h2 {
		margin-bottom: var(--space-4);
		color: var(--text-muted);
		font-size: var(--text-base);
		font-stretch: var(--stretch-body);
		font-weight: 600;
	}

	.email {
		font-size: clamp(1.5rem, 1rem + 2.5vw, 2.5rem);
		font-stretch: var(--stretch-display);
		font-weight: 750;
		overflow-wrap: anywhere;
	}
</style>
