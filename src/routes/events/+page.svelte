<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import EventCard from '$lib/components/EventCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let { data } = $props();

	const pastByYear = $derived(
		Object.entries(
			Object.groupBy(data.past, (event) => String(event.startsAt.getUTCFullYear()))
		).sort(([a], [b]) => Number(b) - Number(a))
	);
</script>

<Seo title={m.concerts()} description={m.concerts_description()} />

<header class="page-intro">
	<h1>{m.concerts()}</h1>
</header>

{#if data.upcoming.length}
	<section aria-labelledby="upcoming">
		<h2 id="upcoming" class="visually-hidden">{m.upcoming_concerts()}</h2>
		{#each data.upcoming as event (event.id)}
			<EventCard {event} />
		{/each}
	</section>
{:else}
	<EmptyState title={m.concerts_empty_title()} text={m.concerts_empty_text()}>
		<Button href={localizePath('/contact')}>{m.cta_booking()}</Button>
	</EmptyState>
{/if}

{#if pastByYear.length}
	<section class="archive" aria-labelledby="archive">
		<h2 id="archive">{m.concert_archive()}</h2>
		{#each pastByYear as [year, events], i (year)}
			<details open={i === 0}>
				<summary>{year}</summary>
				{#each events ?? [] as event (event.id)}
					<EventCard {event} />
				{/each}
			</details>
		{/each}
	</section>
{/if}

<style>
	.archive {
		display: grid;
		gap: var(--space-4);
		margin-top: var(--space-16);
	}

	summary {
		padding: var(--space-3) 0;
		font-size: var(--text-h3);
		font-stretch: var(--stretch-display);
		font-weight: 750;
		cursor: pointer;
	}

	.archive :global(.event) {
		opacity: 0.85;
	}
</style>
