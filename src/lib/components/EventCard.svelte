<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import { getLocale } from '$lib/paraglide/runtime';
	import { eventDateParts, formatEventTime } from '$lib/events/format';

	type Props = {
		event: {
			slug: string;
			title: string;
			startsAt: Date;
			timezone: string;
			venueName: string;
			city: string;
			lineup: string | null;
			status: 'scheduled' | 'cancelled' | 'postponed';
		};
		headingLevel?: 2 | 3;
	};

	let { event, headingLevel = 3 }: Props = $props();

	const locale = getLocale();
	const date = $derived(eventDateParts(event.startsAt, locale, event.timezone));
	const statusLabel = $derived(
		event.status === 'cancelled'
			? m.status_cancelled()
			: event.status === 'postponed'
				? m.status_postponed()
				: null
	);
</script>

<article class="event" class:inactive={event.status !== 'scheduled'}>
	<time class="date" datetime={event.startsAt.toISOString()}>
		<span class="day">{date.day}</span>
		<span class="month">{date.month} {date.year}</span>
		<span class="weekday"
			>{date.weekday}, {formatEventTime(event.startsAt, locale, event.timezone)}</span
		>
	</time>
	<div class="body">
		<svelte:element this={`h${headingLevel}`} class="title">
			<a href={localizePath(`/events/${event.slug}`)}>{event.title}</a>
		</svelte:element>
		<p class="where">{event.venueName}, {event.city}</p>
		{#if event.lineup}<p class="lineup">{event.lineup}</p>{/if}
		{#if statusLabel}<p class="status">{statusLabel}</p>{/if}
	</div>
</article>

<style>
	.event {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: var(--space-6);
		padding: var(--space-6) 0;
		border-top: 1px solid var(--line);
	}

	.date {
		display: grid;
		align-content: start;
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.day {
		color: var(--accent-ink);
		font-size: 3.5rem;
		font-stretch: var(--stretch-display);
		font-weight: 800;
		line-height: 0.9;
	}

	.body {
		display: grid;
		align-content: start;
		gap: var(--space-2);
	}

	.title {
		font-size: var(--text-h3);
	}

	.title a {
		color: var(--text);
		text-decoration: none;
	}

	/* The whole card is the link target. */
	.title a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.event {
		position: relative;
	}

	.event:hover .title a {
		color: var(--accent-ink);
	}

	.where,
	.lineup {
		color: var(--text-muted);
	}

	.inactive .title a,
	.inactive .day {
		text-decoration: line-through;
		text-decoration-thickness: 2px;
	}

	.status {
		justify-self: start;
		padding: 0 var(--space-2);
		border: 1px solid var(--danger);
		border-radius: var(--radius);
		color: var(--danger);
		font-size: var(--text-sm);
		font-weight: 650;
	}
</style>
