<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import EventCard from '$lib/components/EventCard.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PatternPlaceholder from '$lib/components/ui/PatternPlaceholder.svelte';
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
	import { toBcp47 } from '$lib/i18n/format';
	import { pickLocale } from '$lib/i18n/localized';
	import { getLocale } from '$lib/paraglide/runtime';
	import RhythmGrid from '$lib/components/ui/RhythmGrid.svelte';
	import { personLd } from '$lib/seo/jsonld';
	import { socialHref } from '$lib/site';

	let { data } = $props();

	const portraitAlt = $derived(data.portrait ? pickLocale(data.portrait.alt, getLocale()) : null);

	const projects = [
		{ name: 'The Stone Alphabet', note: '' },
		{ name: 'Saitenschlag', note: m.project_saitenschlag() }
	];
</script>

<Seo description={m.home_description()} />
<JsonLd data={personLd()} />

<section class="hero">
	<div class="hero-text">
		<!-- The name is German; marking it keeps Japanese heading rules off the Latin display type. -->
		<h1 lang="de">
			<span class="first">Matthias</span>
			<span class="last">Brodbeck</span>
		</h1>
		<p class="role">{m.hero_role()}</p>
		<RhythmGrid caption={m.rhythm_caption()} playLabel={m.rhythm_play()} />
		<div class="actions">
			<Button href={localizePath('/contact?topic=booking')}>{m.cta_booking()}</Button>
			<Button href={localizePath('/events')} variant="secondary">{m.cta_concerts()}</Button>
		</div>
	</div>
	<div class="portrait">
		{#if data.portrait}
			<ResponsiveImage
				class="portrait-image"
				image={data.portrait}
				alt={portraitAlt?.value ?? ''}
				lang={portraitAlt ? toBcp47(portraitAlt.lang) : undefined}
				sizes="(min-width: 60rem) 20rem, 70vw"
				loading="eager"
				fetchpriority="high"
			/>
		{:else}
			<PatternPlaceholder label={m.portrait_placeholder()} />
		{/if}
	</div>
</section>

{#if data.nextEvents.length}
	<section class="section">
		<h2>{m.next_concerts()}</h2>
		<div>
			{#each data.nextEvents as event (event.id)}
				<EventCard {event} />
			{/each}
			<p class="more"><a href={localizePath('/events')}>{m.all_concerts()}</a></p>
		</div>
	</section>
{/if}

<section class="section bio">
	<h2>{m.biography()}</h2>
	<div class="prose">
		<p class="lead">{m.bio_short()}</p>
		<p><a href={localizePath('/about')}>{m.read_full_bio()}</a></p>
	</div>
</section>

<section class="section">
	<h2>{m.current_projects()}</h2>
	<ul class="projects">
		{#each projects as project (project.name)}
			<li>
				<a href={localizePath('/about#projects')}>{project.name}</a>
				{#if project.note}<span>{project.note}</span>{/if}
			</li>
		{/each}
	</ul>
</section>

<section class="section">
	<h2>{m.video_heading()}</h2>
	<div class="prose">
		<p>{m.video_text()}</p>
		<div>
			<Button
				href={socialHref('YouTube')}
				variant="secondary"
				target="_blank"
				rel="noopener noreferrer"
			>
				{m.video_cta()}<span class="visually-hidden">{m.opens_new_tab()}</span>
			</Button>
		</div>
	</div>
</section>

<style>
	.hero {
		display: grid;
		gap: var(--space-12);
		padding-bottom: var(--space-16);
	}

	.hero-text {
		display: grid;
		gap: var(--space-8);
		align-content: start;
	}

	h1 {
		display: grid;
		font-size: var(--text-hero);
		font-weight: 800;
		line-height: 0.82;
		letter-spacing: -0.02em;
	}

	/* The surname steps in by one grid cell, like an offbeat. */
	.last {
		padding-left: 0.5em;
		color: var(--accent-ink);
	}

	.role {
		font-size: var(--text-lg);
		color: var(--text-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.portrait {
		max-width: min(16rem, 70%);
	}

	.portrait :global(.portrait-image) {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: var(--radius);
	}

	@media (min-width: 60rem) {
		.hero {
			grid-template-columns: 1fr 20rem;
			align-items: end;
		}

		.portrait {
			max-width: none;
		}
	}

	.section {
		display: grid;
		gap: var(--space-6);
		padding: var(--space-12) 0;
		border-top: 1px solid var(--line);
	}

	@media (min-width: 48rem) {
		.section {
			grid-template-columns: 16rem 1fr;
			gap: var(--space-8);
		}
	}

	.more {
		padding-top: var(--space-4);
		border-top: 1px solid var(--line);
	}

	.lead {
		font-size: var(--text-lg);
	}

	.projects {
		display: grid;
		gap: var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.projects li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2) var(--space-4);
	}

	.projects a {
		color: var(--text);
		font-size: var(--text-h2);
		font-stretch: var(--stretch-display);
		font-weight: 750;
		line-height: 1;
		text-decoration: none;
	}

	.projects a:hover {
		color: var(--accent-ink);
	}

	.projects span {
		color: var(--text-muted);
	}
</style>
