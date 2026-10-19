<script lang="ts">
	import { ChevronLeft, ChevronRight, X } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { toBcp47 } from '$lib/i18n/format';
	import { pickLocale } from '$lib/i18n/localized';
	import { socialHref } from '$lib/site';

	let { data } = $props();

	const locale = getLocale();
	const photos = $derived(
		data.photos.map((photo) => ({ ...photo, description: pickLocale(photo.alt, locale) }))
	);

	let dialog = $state<HTMLDialogElement>();
	let current = $state(0);
	// The full-size image is only rendered while the lightbox is open.
	let isOpen = $state(false);
	const shown = $derived(photos[current]);

	function open(index: number) {
		current = index;
		isOpen = true;
		dialog?.showModal();
	}

	function step(delta: number) {
		current = (current + delta + photos.length) % photos.length;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') step(-1);
		if (event.key === 'ArrowRight') step(1);
	}
</script>

<Seo title={m.gallery()} description={m.gallery_description()} />

<header class="page-intro">
	<h1>{m.gallery()}</h1>
</header>

{#if photos.length === 0}
	<EmptyState title={m.gallery_empty_title()} text={m.gallery_empty_text()}>
		<Button href={socialHref('Instagram')} target="_blank" rel="noopener noreferrer">
			{m.gallery_empty_cta()}<span class="visually-hidden">{m.opens_new_tab()}</span>
		</Button>
	</EmptyState>
{:else}
	<ul class="grid">
		{#each photos as photo, i (photo.id)}
			<li>
				<!-- Without JS the button does nothing; the photo is still fully shown in the grid. -->
				<button type="button" onclick={() => open(i)} aria-haspopup="dialog">
					<ResponsiveImage
						image={photo}
						alt={photo.description?.value ?? ''}
						lang={photo.description ? toBcp47(photo.description.lang) : undefined}
						sizes="(min-width: 72rem) 22rem, (min-width: 40rem) 45vw, 100vw"
						loading={i < 3 ? 'eager' : 'lazy'}
					/>
				</button>
			</li>
		{/each}
	</ul>
	<p class="more">
		<a href={socialHref('Instagram')} target="_blank" rel="noopener noreferrer">
			{m.gallery_more()}<span class="visually-hidden">{m.opens_new_tab()}</span>
		</a>
	</p>

	<dialog
		bind:this={dialog}
		class="lightbox"
		aria-label={m.gallery_position({ current: current + 1, total: photos.length })}
		onkeydown={onKeydown}
		onclose={() => (isOpen = false)}
	>
		{#if isOpen && shown}
			<figure>
				<ResponsiveImage
					image={shown}
					alt={shown.description?.value ?? ''}
					lang={shown.description ? toBcp47(shown.description.lang) : undefined}
					sizes="100vw"
					loading="eager"
				/>
				<figcaption>
					<span aria-live="polite">
						{m.gallery_position({ current: current + 1, total: photos.length })}
					</span>
					{#if shown.credit}<span>{m.photo_credit({ name: shown.credit })}</span>{/if}
				</figcaption>
			</figure>
		{/if}
		<div class="controls">
			<button type="button" onclick={() => step(-1)} disabled={photos.length < 2}>
				<ChevronLeft aria-hidden="true" /><span class="visually-hidden">{m.gallery_previous()}</span
				>
			</button>
			<button type="button" onclick={() => step(1)} disabled={photos.length < 2}>
				<ChevronRight aria-hidden="true" /><span class="visually-hidden">{m.gallery_next()}</span>
			</button>
			<button type="button" onclick={() => dialog?.close()}>
				<X aria-hidden="true" /><span class="visually-hidden">{m.gallery_close()}</span>
			</button>
		</div>
	</dialog>
{/if}

<style>
	.grid {
		columns: 18rem auto;
		column-gap: var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid li {
		margin-bottom: var(--space-4);
		break-inside: avoid;
	}

	.grid button {
		display: block;
		width: 100%;
		padding: 0;
		background: none;
		border: 0;
		cursor: zoom-in;
	}

	.grid :global(img) {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}

	.more {
		margin-top: var(--space-8);
	}

	.lightbox {
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		margin: 0;
		padding: var(--space-4);
		background: rgb(10 8 6 / 0.96);
		color: #efe7d8;
		border: 0;
	}

	.lightbox[open] {
		display: grid;
		grid-template-rows: 1fr auto;
		gap: var(--space-4);
	}

	figure {
		display: grid;
		grid-template-rows: 1fr auto;
		gap: var(--space-3);
		min-height: 0;
		margin: 0;
	}

	figure :global(img) {
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: contain;
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-2) var(--space-6);
		font-size: var(--text-sm);
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
	}

	.controls button {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		background: transparent;
		border: 1px solid #5a4c3e;
		border-radius: 50%;
		color: #efe7d8;
		cursor: pointer;
	}

	.controls button:hover:not(:disabled) {
		border-color: #e3a33a;
	}
</style>
