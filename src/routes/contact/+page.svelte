<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { CONTACT_EMAIL } from '$lib/site';

	let { data, form } = $props();
</script>

<Seo title={m.contact()} description={m.contact_description()} />

<header class="page-intro">
	<h1>{m.contact_heading()}</h1>
	<p>{m.contact_intro()}</p>
</header>

<div class="layout">
	<ContactForm topic={data.topic} turnstileSiteKey={data.turnstileSiteKey} {form} />

	<aside>
		<section>
			<h2>{m.contact_or_email()}</h2>
			<a class="email" href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>
		</section>
		<section>
			<h2>{m.contact_elsewhere()}</h2>
			<SocialLinks showLabels />
		</section>
	</aside>
</div>

<style>
	.layout {
		display: grid;
		gap: var(--space-12);
		padding-top: var(--space-12);
		border-top: 1px solid var(--line);
	}

	@media (min-width: 60rem) {
		.layout {
			grid-template-columns: 1fr 18rem;
		}
	}

	aside {
		display: grid;
		gap: var(--space-8);
		align-content: start;
	}

	h2 {
		margin-bottom: var(--space-3);
		color: var(--text-muted);
		font-size: var(--text-base);
		font-stretch: var(--stretch-body);
		font-weight: 600;
	}

	.email {
		overflow-wrap: anywhere;
	}
</style>
