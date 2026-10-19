<script lang="ts">
	import { CalendarPlus, MapPin } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import { getLocale } from '$lib/paraglide/runtime';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatEventDate, formatEventTime } from '$lib/events/format';
	import { pickLocale } from '$lib/i18n/localized';
	import { toBcp47 } from '$lib/i18n/format';
	import { musicEventLd } from '$lib/seo/jsonld';
	import { absoluteUrl } from '$lib/seo/url';

	let { data } = $props();

	const locale = getLocale();
	const event = $derived(data.event);
	const description = $derived(pickLocale(event.description, locale));
	const date = $derived(formatEventDate(event.startsAt, locale, event.timezone));
	const start = $derived(formatEventTime(event.startsAt, locale, event.timezone));
	const time = $derived(
		event.endsAt
			? m.event_time_range({ start, end: formatEventTime(event.endsAt, locale, event.timezone) })
			: m.event_time({ start })
	);
	const address = $derived(
		[event.street, [event.postalCode, event.city].filter(Boolean).join(' ')]
			.filter(Boolean)
			.join(', ')
	);
	const mapUrl = $derived(
		`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${event.venueName}, ${address}`)}`
	);
	const url = $derived(absoluteUrl(`/events/${event.slug}`, locale));
</script>

<Seo title={event.title} description="{date} – {event.venueName}, {event.city}" />
<JsonLd data={musicEventLd({ ...event, description: description?.value ?? null }, url)} />

<article class="event">
	<header class="page-intro">
		<p class="when">
			<time datetime={event.startsAt.toISOString()}>{date}</time>, {time}
		</p>
		<h1>{event.title}</h1>
		{#if event.lineup}<p>{event.lineup}</p>{/if}
	</header>

	{#if event.status !== 'scheduled'}
		<p class="status-notice" role="status">
			{event.status === 'cancelled' ? m.event_cancelled_notice() : m.event_postponed_notice()}
		</p>
	{/if}

	<div class="details">
		<section>
			<h2>{m.event_venue()}</h2>
			<p class="venue">{event.venueName}</p>
			{#if address}<p>{address}</p>{/if}
			<p class="links">
				<a href={mapUrl} target="_blank" rel="noopener noreferrer">
					<MapPin size={16} aria-hidden="true" />
					{m.event_map()}<span class="visually-hidden">{m.opens_new_tab()}</span>
				</a>
				{#if event.venueUrl}
					<a href={event.venueUrl} target="_blank" rel="noopener noreferrer">
						{m.event_venue_website()}<span class="visually-hidden">{m.opens_new_tab()}</span>
					</a>
				{/if}
			</p>
		</section>

		{#if description}
			<section class="prose" lang={toBcp47(description.lang)}>
				{#each description.value.split(/\n{2,}/) as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
			</section>
		{/if}
	</div>

	<div class="actions">
		{#if event.ticketUrl && event.status === 'scheduled'}
			<Button href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
				{m.event_tickets()}<span class="visually-hidden">: {event.title} {m.opens_new_tab()}</span>
			</Button>
		{/if}
		{#if event.status !== 'cancelled'}
			<Button href="/events/{event.slug}/calendar.ics" variant="secondary" download>
				<CalendarPlus size={18} aria-hidden="true" />
				{m.event_add_to_calendar()}
			</Button>
		{/if}
	</div>

	<p class="back"><a href={localizePath('/events')}>{m.all_concerts()}</a></p>
</article>

<style>
	.when {
		color: var(--accent-ink);
		font-weight: 650;
	}

	.status-notice {
		max-width: var(--prose-max);
		margin-bottom: var(--space-8);
		padding: var(--space-4);
		border-left: 3px solid var(--danger);
		background: var(--surface);
	}

	.details {
		display: grid;
		gap: var(--space-8);
		padding-top: var(--space-8);
		border-top: 1px solid var(--line);
	}

	@media (min-width: 48rem) {
		.details {
			grid-template-columns: 16rem 1fr;
		}
	}

	h2 {
		margin-bottom: var(--space-2);
		color: var(--text-muted);
		font-size: var(--text-base);
		font-stretch: var(--stretch-body);
		font-weight: 600;
	}

	.venue {
		font-weight: 700;
	}

	.links {
		display: grid;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}

	.links a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-12);
	}

	.back {
		margin-top: var(--space-12);
	}
</style>
