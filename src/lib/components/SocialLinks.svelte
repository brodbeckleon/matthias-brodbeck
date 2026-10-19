<script lang="ts">
	import { Facebook, Instagram, Youtube } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { SOCIAL_LINKS } from '$lib/site';

	let { showLabels = false }: { showLabels?: boolean } = $props();

	const ICONS = { Instagram, YouTube: Youtube, Facebook };
</script>

<ul class="social" class:labelled={showLabels}>
	{#each SOCIAL_LINKS as link (link.href)}
		{@const Icon = ICONS[link.platform]}
		<li>
			<a href={link.href} target="_blank" rel="noopener noreferrer">
				<Icon size={20} aria-hidden="true" />
				{#if showLabels}
					<span>{link.platform}</span>
					<span class="visually-hidden">{m.opens_new_tab()}</span>
				{:else}
					<span class="visually-hidden">
						{m.on_platform({ platform: link.platform })}
						{m.opens_new_tab()}
					</span>
				{/if}
			</a>
		</li>
	{/each}
</ul>

<style>
	.social {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.labelled {
		flex-direction: column;
		gap: var(--space-3);
	}

	a {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 2.5rem;
		min-height: 2.5rem;
		justify-content: center;
		color: var(--text);
	}

	.labelled a {
		justify-content: flex-start;
		color: var(--accent-ink);
	}

	a:hover {
		color: var(--accent-ink);
	}
</style>
