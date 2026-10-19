<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		href: string;
		variant?: 'primary' | 'secondary';
		children: Snippet;
	};

	let { href, variant = 'primary', children, ...rest }: Props = $props();
</script>

<a {href} class="button {variant}" {...rest}>{@render children()}</a>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: 3rem;
		padding: 0 var(--space-6);
		border: 2px solid var(--accent);
		border-radius: var(--radius);
		font-weight: 650;
		text-decoration: none;
		transition:
			background-color var(--step) ease-out,
			color var(--step) ease-out;
	}

	.primary {
		background: var(--accent);
		color: var(--on-accent);
	}

	.primary:hover {
		background: transparent;
		color: var(--accent-ink);
	}

	.secondary {
		background: transparent;
		color: var(--text);
	}

	.secondary:hover {
		background: var(--accent);
		color: var(--on-accent);
	}
</style>
