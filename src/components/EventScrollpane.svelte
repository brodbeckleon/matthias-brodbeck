<script lang="ts">
	import { onMount } from 'svelte';
	import { Rewind, FastForward, Play, Pause } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { z } from 'zod';

	const eventSchema = z.object({
		date: z.string(),
		title: z.string(),
		place: z.string()
	});

	type Event = z.infer<typeof eventSchema>;

	let { events = [] }: { events: Event[] } = $props();

	let listContainerEl: HTMLElement;
	let scrollLeft = $state(0);
	let ITEM_SPACING = 0;
	const scrollIndex = $derived(scrollLeft / ITEM_SPACING);

	onMount(() => {
		if (listContainerEl && listContainerEl.children.length > 1) {
			const first = listContainerEl.children[0] as HTMLElement;
			const second = listContainerEl.children[1] as HTMLElement;
			ITEM_SPACING = second.offsetLeft - first.offsetLeft;
		}
		scrollToToday();
	});

	function findNextEventIndex() {
		const today = new Date();
		const nextEventIndex = events.findIndex((e) => new Date(e.date) >= today);
		return nextEventIndex === -1 ? events.length - 1 : nextEventIndex;
	}

	function scrollToToday() {
		if (!listContainerEl) return;
		const targetIndex = findNextEventIndex();
		const targetScrollLeft = targetIndex * ITEM_SPACING;
		listContainerEl.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
	}

	function scrollPrev() {
		if (!listContainerEl) return;
		const currentIndex = Math.round(scrollIndex);
		const newScrollLeft = Math.max(0, (currentIndex - 1) * ITEM_SPACING);
		listContainerEl.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
	}

	function scrollNext() {
		if (!listContainerEl) return;
		const currentIndex = Math.round(scrollIndex);
		const newScrollLeft = Math.min(
			(events.length - 1) * ITEM_SPACING,
			(currentIndex + 1) * ITEM_SPACING
		);
		listContainerEl.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
	}
</script>

<div class="scroller">
	<div
		class="list-container"
		bind:this={listContainerEl}
		onscroll={(e) => (scrollLeft = e.currentTarget.scrollLeft)}
	>
		{#each events as event, i}
			{@const diff = Math.abs(i - Math.round(scrollIndex))}
			<div
				class="event"
				style:transform="scale({1 - diff * 0.15})"
				style:opacity={Math.max(0, 1 - diff * 0.4)}
				style:z-index={100 - diff}
				class:active={i === Math.round(scrollIndex)}
			>
				<p class="date">{event.date}</p>
				<h3>{event.title}</h3>
				<p class="place">{event.place}</p>
			</div>
		{/each}
	</div>

    {#if events.length > 0}
        <div class="controls">
            <button class="nav-button prev" onclick={scrollPrev} aria-label={m.go_to_previous_event()}>
                <Rewind />
            </button>
            <button class="nav-button" onclick={scrollToToday} aria-label={m.jump_to_next_event()}>
                {#if Math.round(scrollIndex) === findNextEventIndex()}
                    <Pause />
                {:else}
                    <Play />
                {/if}
            </button>
            <button class="nav-button next" onclick={scrollNext} aria-label={m.go_to_next_event()}>
                <FastForward />
            </button>
        </div>
    {:else }
        <p>{m.no_events_available()}</p>
    {/if}
</div>

<style>
	:root {
		--list-width: 100%;
		--item-width: 250px;
		--item-height: 120px;
		--item-gap: 30px;
	}

	.scroller,
	.list-container,
	.event {
		box-sizing: border-box;
	}

	.scroller {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--bg);
		color: var(--text);
		font-family: system-ui, sans-serif;
		overflow: hidden;
		gap: 1.5rem;
		margin-top: 5rem;
		width: 100%;
	}

	.list-container {
		width: var(--list-width);
		max-width: 800px;
		height: calc(var(--item-height) + 40px);
		overflow-x: scroll;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-ms-overflow-style: none;
		scrollbar-width: none;
		display: flex;
		align-items: center;
		gap: var(--item-gap);
	}

	.list-container::-webkit-scrollbar {
		display: none;
	}

	.list-container {
		padding-left: calc(50% - var(--item-width) / 2);
		padding-right: calc(50% - var(--item-width) / 2);
	}

	.event {
		scroll-snap-align: center;
		flex-shrink: 0;
		width: var(--item-width);
		height: var(--item-height);
		text-align: center;
		padding: 1rem;
		border-radius: 1rem;
		background: var(--bg-secondary);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		will-change: transform, opacity;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition:
			transform 0.2s ease-out,
			opacity 0.2s ease-out;
	}

	.event.active {
		transform: scale(1.1);
		background: var(--accent);
		color: var(--bg);
		box-shadow: 0 0 20px var(--accent);
		z-index: 999;
	}

	.date {
		font-size: 0.9rem;
		opacity: 0.7;
		margin: 0;
	}

	h3 {
		margin: 0.2rem 0;
	}

	.place {
		font-size: 0.9rem;
		opacity: 0.8;
		margin: 0;
	}

	.controls {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	.nav-button {
		background: var(--accent);
		color: var(--bg);
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-button:hover {
		background: var(--text);
		color: var(--bg);
	}
</style>
