<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		text: string;
		children?: Snippet;
	};

	let { title, text, children }: Props = $props();
</script>

<section class="empty">
	<h2>{title}</h2>
	<p>{text}</p>
	{#if children}
		<div class="actions">{@render children()}</div>
	{/if}
</section>

<style>
	.empty {
		display: grid;
		gap: var(--space-4);
		max-width: var(--prose-max);
		padding: var(--space-8) 0 var(--space-8) var(--space-6);
		border-left: 3px solid var(--accent);
	}

	h2 {
		font-size: var(--text-h3);
	}

	p {
		color: var(--text-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-2);
	}
</style>
