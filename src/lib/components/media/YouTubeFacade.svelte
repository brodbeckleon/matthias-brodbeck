<script lang="ts">
	import { Play } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';

	type Props = { youtubeId: string; title: string; thumbnailUrl: string | null };

	let { youtubeId, title, thumbnailUrl }: Props = $props();

	// Nothing is requested from YouTube until the visitor asks for the video.
	let playing = $state(false);
</script>

<div class="video">
	{#if playing}
		<iframe
			src="https://www.youtube-nocookie.com/embed/{youtubeId}?autoplay=1&rel=0"
			{title}
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
	{:else}
		<button type="button" onclick={() => (playing = true)}>
			{#if thumbnailUrl}
				<img src={thumbnailUrl} alt="" loading="lazy" width="480" height="360" />
			{/if}
			<span class="play" aria-hidden="true"><Play size={28} /></span>
			<span class="visually-hidden">{m.video_play({ title })}</span>
		</button>
	{/if}
</div>

<style>
	.video {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--surface);
		border-radius: var(--radius);
	}

	iframe,
	button,
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	button {
		display: grid;
		place-items: center;
		padding: 0;
		background: transparent;
		cursor: pointer;
	}

	img {
		object-fit: cover;
	}

	.play {
		position: relative;
		display: grid;
		place-items: center;
		width: 4rem;
		height: 4rem;
		padding-left: 4px;
		background: var(--accent);
		border-radius: 50%;
		color: var(--on-accent);
		transition: transform var(--step) var(--ease-hit);
	}

	button:hover .play,
	button:focus-visible .play {
		transform: scale(1.08);
	}
</style>
