<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { personLd } from '$lib/seo/jsonld';

	// One message per locale, "|"-separated, so Japanese can use katakana.
	const collaborators = m.collaborators().split('|');

	const currentProjects = [
		{ name: 'The Stone Alphabet', note: '' },
		{ name: 'Saitenschlag', note: m.project_saitenschlag() }
	];

	const pastProjects = [
		{ name: 'P-27', note: m.project_p27() },
		{ name: 'Chapter 12', note: m.project_chapter12() },
		{ name: 'Metrix', note: m.project_metrix() }
	];
</script>

<Seo title={m.about()} description={m.about_description()} />
<JsonLd data={personLd()} />

<h1>{m.about()}</h1>

<section class="section" aria-labelledby="biography">
	<h2 id="biography">{m.biography()}</h2>
	<div class="prose">
		<p>{m.cv_1()}</p>
		<p>{m.cv_2()}</p>
		<p>{m.cv_4()}</p>
		<p>{m.cv_5()}</p>
	</div>
</section>

<section class="section" aria-labelledby="worked-with">
	<h2 id="worked-with">{m.worked_with()}</h2>
	<div>
		<p class="intro">{m.worked_with_intro()}</p>
		<ul class="collaborators">
			{#each collaborators as name (name)}
				<li>{name}</li>
			{/each}
		</ul>
	</div>
</section>

<section class="section" id="projects" aria-labelledby="projects-heading">
	<h2 id="projects-heading">{m.projects()}</h2>
	<div class="project-groups">
		{#each [{ label: m.projects_current(), items: currentProjects }, { label: m.projects_past(), items: pastProjects }] as group (group.label)}
			<div>
				<h3>{group.label}</h3>
				<ul class="projects">
					{#each group.items as project (project.name)}
						<li>
							<span class="project-name">{project.name}</span>
							{#if project.note}<span class="note">{project.note}</span>{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<section class="section" id="press" aria-labelledby="press-heading">
	<h2 id="press-heading">{m.press_kit()}</h2>
	<div class="prose">
		<p>{m.press_text()}</p>
		<figure class="short-bio">
			<figcaption>
				<h3>{m.press_short_bio()}</h3>
				<CopyButton text={m.bio_short()} />
			</figcaption>
			<blockquote>{m.bio_short()}</blockquote>
		</figure>
		<div>
			<Button href={localizePath('/contact')} variant="secondary">{m.press_request()}</Button>
		</div>
	</div>
</section>

<style>
	h1 {
		margin-bottom: var(--space-12);
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

	.intro {
		margin-bottom: var(--space-4);
		color: var(--text-muted);
	}

	.collaborators {
		columns: 15rem auto;
		column-gap: var(--space-8);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.collaborators li {
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--line);
		break-inside: avoid;
	}

	.project-groups {
		display: grid;
		gap: var(--space-8);
	}

	h3 {
		margin-bottom: var(--space-3);
		color: var(--text-muted);
		font-size: var(--text-base);
		font-stretch: var(--stretch-body);
		font-weight: 600;
	}

	.projects {
		display: grid;
		gap: var(--space-3);
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

	.project-name {
		font-size: var(--text-h3);
		font-stretch: var(--stretch-display);
		font-weight: 750;
	}

	.note {
		color: var(--text-muted);
	}

	.short-bio {
		margin: 0;
		padding: var(--space-6);
		background: var(--surface);
		border-radius: var(--radius);
	}

	.short-bio figcaption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-3);
	}

	.short-bio h3 {
		margin: 0;
	}

	blockquote {
		margin: 0;
	}
</style>
