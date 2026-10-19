<script lang="ts">
	type Props = {
		/** Shown and announced; leave empty for a purely decorative placeholder. */
		label: string;
		/** CSS aspect-ratio, e.g. "4 / 5". */
		ratio?: string;
	};

	let { label, ratio = '4 / 5' }: Props = $props();

	// Eight tension lugs around the rim, like a drumhead seen from above.
	const lugs = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
</script>

<!-- Stands in for photos that have not been supplied yet. -->
<div
	class="placeholder"
	style:aspect-ratio={ratio}
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	<svg viewBox="-50 -50 100 100" aria-hidden="true">
		<circle r="44" class="rim" />
		<circle r="38" class="head" />
		<circle r="12" class="dot" />
		{#each lugs as angle (angle)}
			<rect
				x="-2"
				y="-49"
				width="4"
				height="7"
				rx="1"
				class="lug"
				transform="rotate({(angle * 180) / Math.PI})"
			/>
		{/each}
	</svg>
	{#if label}<span>{label}</span>{/if}
</div>

<style>
	.placeholder {
		display: grid;
		place-items: center;
		align-content: center;
		gap: var(--space-4);
		width: 100%;
		padding: var(--space-8);
		background: var(--surface);
		border-radius: var(--radius);
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	svg {
		width: min(70%, 14rem);
	}

	.rim {
		fill: none;
		stroke: var(--line);
		stroke-width: 3;
	}

	.head {
		fill: var(--bg);
		stroke: var(--line);
	}

	.dot {
		fill: var(--surface);
	}

	.lug {
		fill: var(--line);
	}
</style>
