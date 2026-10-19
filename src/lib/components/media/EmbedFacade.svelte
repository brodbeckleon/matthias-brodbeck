<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { embedPlatform } from '$lib/music/embeds';

	type Props = { src: string; title: string };

	let { src, title }: Props = $props();

	const platform = $derived(embedPlatform(src));
	let loaded = $state(false);
</script>

{#if platform}
	{#if loaded}
		<iframe {src} {title} class:bandcamp={platform === 'Bandcamp'} loading="lazy"></iframe>
	{:else}
		<div class="facade">
			<button type="button" onclick={() => (loaded = true)}>{m.embed_load({ platform })}</button>
			<span>{m.embed_privacy({ platform })}</span>
		</div>
	{/if}
{/if}

<style>
	iframe {
		width: 100%;
		height: 166px;
		border: 0;
		border-radius: var(--radius);
	}

	iframe.bandcamp {
		height: 120px;
	}

	.facade {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		color: var(--text-muted);
	}

	button {
		min-height: 2.5rem;
		padding: 0 var(--space-4);
		background: transparent;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--accent-ink);
		cursor: pointer;
	}

	button:hover {
		border-color: var(--accent);
	}
</style>
