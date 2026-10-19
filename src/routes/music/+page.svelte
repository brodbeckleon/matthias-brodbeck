<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import EmbedFacade from '$lib/components/media/EmbedFacade.svelte';
	import YouTubeFacade from '$lib/components/media/YouTubeFacade.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import PatternPlaceholder from '$lib/components/ui/PatternPlaceholder.svelte';
	import { socialHref } from '$lib/site';

	let { data } = $props();

	const isEmpty = $derived(data.videos.length === 0 && data.releases.length === 0);
</script>

<Seo title={m.music()} description={m.music_description()} />

<header class="page-intro">
	<h1>{m.music()}</h1>
</header>

{#if isEmpty}
	<EmptyState title={m.music_empty_title()} text={m.music_empty_text()}>
		<Button href={socialHref('YouTube')} target="_blank" rel="noopener noreferrer">
			{m.music_empty_cta()}<span class="visually-hidden">{m.opens_new_tab()}</span>
		</Button>
	</EmptyState>
{/if}

{#if data.videos.length}
	<section class="section" aria-labelledby="watch">
		<h2 id="watch">{m.music_watch()}</h2>
		<div>
			<ul class="videos">
				{#each data.videos as video (video.id)}
					<li>
						<YouTubeFacade
							youtubeId={video.youtubeId}
							title={video.title}
							thumbnailUrl={video.thumbnailUrl}
						/>
						<h3>{video.title}</h3>
					</li>
				{/each}
			</ul>
			<p class="note">
				{m.video_privacy()}
				<a href={socialHref('YouTube')} target="_blank" rel="noopener noreferrer">
					{m.video_cta()}<span class="visually-hidden">{m.opens_new_tab()}</span>
				</a>
			</p>
		</div>
	</section>
{/if}

{#if data.releases.length}
	<section class="section" aria-labelledby="discography">
		<h2 id="discography">{m.music_discography()}</h2>
		<ul class="releases">
			{#each data.releases as release (release.id)}
				<li>
					<div class="cover">
						{#if release.cover}
							<ResponsiveImage image={release.cover} alt="" sizes="10rem" />
						{:else}
							<PatternPlaceholder label="" ratio="1 / 1" />
						{/if}
					</div>
					<div class="details">
						<h3>{release.title}</h3>
						<p class="artist">
							{release.artist}{release.year ? `, ${release.year}` : ''}{release.label
								? `, ${release.label}`
								: ''}
						</p>
						<!-- Entered in German in the admin area. -->
						{#if release.role}<p class="role" lang="de-CH">{release.role}</p>{/if}
						{#if release.links.length}
							<ul class="links">
								{#each release.links as link (link.url)}
									<li>
										<a href={link.url} target="_blank" rel="noopener noreferrer">
											{link.label}<span class="visually-hidden">{m.opens_new_tab()}</span>
										</a>
									</li>
								{/each}
							</ul>
						{/if}
						{#if release.embedUrl}
							<EmbedFacade src={release.embedUrl} title={`${release.title} – ${release.artist}`} />
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
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

	.videos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: var(--space-8) var(--space-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.videos li {
		display: grid;
		gap: var(--space-3);
		align-content: start;
	}

	h3 {
		font-size: var(--text-h3);
	}

	.note {
		margin-top: var(--space-6);
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.releases {
		display: grid;
		gap: var(--space-8);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.releases > li {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 40rem) {
		.releases > li {
			grid-template-columns: 10rem 1fr;
		}
	}

	.cover :global(img) {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: var(--radius);
	}

	.cover :global(.placeholder) {
		padding: var(--space-2);
	}

	.details {
		display: grid;
		gap: var(--space-2);
		align-content: start;
	}

	.artist,
	.role {
		color: var(--text-muted);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
