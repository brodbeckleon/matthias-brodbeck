<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import { CONTACT_EMAIL } from '$lib/site';
	import SocialLinks from './SocialLinks.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="inner">
		<div class="who">
			<p class="name">Matthias Brodbeck</p>
			<p>{m.role()}</p>
			<a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>
		</div>

		<SocialLinks />

		<ul class="legal">
			<li><a href={localizePath('/about#press')}>{m.press_kit()}</a></li>
			<li><a href={localizePath('/impressum')}>{m.impressum()}</a></li>
			<li><a href={localizePath('/privacy')}>{m.privacy()}</a></li>
		</ul>

		<p class="copyright">© {year} Matthias Brodbeck</p>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: var(--space-24);
		border-top: 1px solid var(--line);
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.inner {
		display: grid;
		gap: var(--space-8);
		max-width: var(--content-max);
		margin: 0 auto;
		padding: var(--space-12) var(--gutter);
	}

	.who {
		display: grid;
		gap: var(--space-1);
	}

	.name {
		color: var(--text);
		font-size: var(--text-h3);
		font-stretch: var(--stretch-display);
		font-weight: 750;
	}

	.legal {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.legal a {
		color: var(--text-muted);
	}

	.legal a:hover {
		color: var(--accent-ink);
	}

	@media (min-width: 48rem) {
		.inner {
			grid-template-columns: 1fr auto;
			align-items: end;
		}

		.copyright {
			text-align: right;
		}
	}
</style>
