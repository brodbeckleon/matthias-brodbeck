<script lang="ts">
	import { Play } from '@lucide/svelte';

	type Props = {
		/** One character per sixteenth note: "x" is a hit, anything else a rest. */
		pattern?: string;
		bpm?: number;
		caption: string;
		playLabel: string;
	};

	// Son clave, 3-2 side first.
	let { pattern = 'x..x..x...x.x...', bpm = 100, caption, playLabel }: Props = $props();

	const steps = $derived([...pattern].map((char) => char === 'x'));
	const stepMs = $derived(60_000 / bpm / 4);

	// Bumping this re-creates the steps, which restarts their CSS animation.
	let run = $state(0);
	let audio: AudioContext | undefined;

	async function play() {
		audio ??= new AudioContext();
		// Mobile browsers suspend the context when the tab is in the background.
		if (audio.state !== 'running') await audio.resume();
		const start = audio.currentTime + 0.05;
		steps.forEach((hit, i) => {
			if (hit) strike(audio!, start + (i * stepMs) / 1000);
		});
		run++;
	}

	// A short, bright sine burst reads as a wooden clave.
	function strike(ctx: AudioContext, time: number) {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.frequency.setValueAtTime(2500, time);
		gain.gain.setValueAtTime(0.0001, time);
		gain.gain.exponentialRampToValueAtTime(0.4, time + 0.002);
		gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
		osc.connect(gain).connect(ctx.destination);
		osc.start(time);
		osc.stop(time + 0.07);
	}
</script>

<!-- On load the bar plays after a short pause; on Play it starts with the 50ms audio lead. -->
<figure class="rhythm" style:--step-ms="{stepMs}ms" style:--lead={run === 0 ? '400ms' : '50ms'}>
	{#key run}
		<ol class="steps" aria-hidden="true">
			{#each steps as hit, i (i)}
				<!-- Every fourth grid column is a spacer that groups the sixteenths into beats. -->
				<li class:hit style:--i={i} style:grid-column={i + Math.floor(i / 4) + 1}></li>
			{/each}
		</ol>
	{/key}
	<figcaption>
		<button type="button" onclick={play}>
			<Play size={16} aria-hidden="true" />
			<span class="visually-hidden">{playLabel}</span>
		</button>
		<span>{caption}</span>
	</figcaption>
</figure>

<style>
	.rhythm {
		display: grid;
		gap: var(--space-3);
		margin: 0;
	}

	.steps {
		display: grid;
		--beat-gap: clamp(1px, 0.6vw, 8px);
		grid-template-columns:
			repeat(4, 1fr) var(--beat-gap) repeat(4, 1fr) var(--beat-gap)
			repeat(4, 1fr) var(--beat-gap) repeat(4, 1fr);
		gap: clamp(3px, 0.6vw, 6px);
		height: clamp(2.5rem, 6vw, 4rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		border: 1px solid var(--line);
		border-radius: 2px;
		transform-origin: bottom;
		animation: playhead calc(var(--step-ms) * 2) var(--ease-hit) forwards;
		animation-delay: calc(var(--i) * var(--step-ms) + var(--lead));
	}

	li.hit {
		background: var(--accent);
		border-color: var(--accent);
		animation-name: strike;
		animation-fill-mode: both;
	}

	@keyframes playhead {
		0% {
			background: var(--text-muted);
		}
		100% {
			background: transparent;
		}
	}

	@keyframes strike {
		0% {
			transform: scaleY(0.35);
			background: var(--text);
		}
		100% {
			transform: scaleY(1);
			background: var(--accent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		li {
			animation: none;
		}
	}

	figcaption {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	button {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: transparent;
		border: 1px solid var(--line);
		border-radius: 50%;
		color: var(--accent-ink);
		cursor: pointer;
	}

	button:hover {
		border-color: var(--accent);
	}
</style>
