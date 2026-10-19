<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { text }: { text: string } = $props();

	let copied = $state(false);
	let failed = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard access needs a secure context and permission; the text stays selectable.
			failed = true;
		}
	}
</script>

<button type="button" onclick={copy} hidden={failed}>
	{#if copied}
		<Check size={16} aria-hidden="true" />
	{:else}
		<Copy size={16} aria-hidden="true" />
	{/if}
	<span aria-live="polite">{copied ? m.copied() : m.copy_text()}</span>
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 2.5rem;
		padding: 0 var(--space-3);
		background: transparent;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--accent-ink);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	button:hover {
		border-color: var(--accent);
	}
</style>
