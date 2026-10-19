<script lang="ts">
	import { Languages } from '@lucide/svelte';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import { deLocalizeHref, getLocale, locales } from '$lib/paraglide/runtime';
	import { LOCALE_NAMES, toBcp47 } from '$lib/i18n/format';

	let details: HTMLDetailsElement;

	const current = getLocale();
	const basePath = $derived(deLocalizeHref(page.url.pathname));

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && details.open) {
			details.open = false;
			details.querySelector('summary')?.focus();
		}
	}

	function onWindowClick(event: MouseEvent) {
		if (details.open && !details.contains(event.target as Node)) details.open = false;
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<!-- A native <details> disclosure: works without JS, and the links stay in the HTML for crawlers. -->
<details class="language" bind:this={details}>
	<summary>
		<Languages size={18} aria-hidden="true" />
		<span class="visually-hidden">{m.language()}:</span>
		<span class="current">{LOCALE_NAMES[current]}</span>
	</summary>
	<ul>
		{#each locales as locale (locale)}
			<li>
				<!-- Full reload: messages are resolved once per page load. -->
				<a
					href={localizePath(basePath, { locale })}
					hreflang={toBcp47(locale)}
					lang={toBcp47(locale)}
					aria-current={locale === current ? 'true' : undefined}
					data-sveltekit-reload
				>
					{LOCALE_NAMES[locale]}
				</a>
			</li>
		{/each}
	</ul>
</details>

<style>
	.language {
		position: relative;
	}

	summary {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 2.5rem;
		padding: 0 var(--space-2);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		cursor: pointer;
		list-style: none;
	}

	.current {
		white-space: nowrap;
	}

	/* On narrow screens the icon is enough; the visually hidden label still names the control. */
	@media (max-width: 30rem) {
		.current {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		color: var(--accent-ink);
	}

	ul {
		position: absolute;
		top: calc(100% + var(--space-1));
		right: 0;
		z-index: 20;
		min-width: 9rem;
		margin: 0;
		padding: var(--space-1) 0;
		list-style: none;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}

	a {
		display: block;
		padding: var(--space-2) var(--space-4);
		color: var(--text);
		text-decoration: none;
	}

	a:hover {
		background: var(--bg);
		color: var(--accent-ink);
	}

	a[aria-current='true'] {
		font-weight: 700;
	}
</style>
