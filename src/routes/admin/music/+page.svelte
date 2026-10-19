<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Musik – Website verwalten</title>
</svelte:head>

<h1>Musik</h1>

<section>
	<h2>Videos</h2>
	<form method="POST" action="?/addVideo" use:enhance class="add">
		<div class="field">
			<label for="url">YouTube-Adresse</label>
			<input
				id="url"
				name="url"
				value={form?.url ?? ''}
				placeholder="https://www.youtube.com/watch?v=…"
				required
				aria-invalid={form?.error ? 'true' : undefined}
				aria-describedby={form?.error ? 'video-error' : undefined}
			/>
		</div>
		<div class="field">
			<label for="title">Titel</label>
			<input id="title" name="title" value={form?.title ?? ''} aria-describedby="title-hint" />
			<p class="hint" id="title-hint">Leer lassen, um den Titel von YouTube zu übernehmen.</p>
		</div>
		<div>
			<button class="btn" type="submit">Video hinzufügen</button>
		</div>
		{#if form?.error}<p class="error" id="video-error" role="alert">{form.error}</p>{/if}
	</form>

	{#if data.videos.length === 0}
		<p class="empty">Noch keine Videos.</p>
	{:else}
		<ul class="list">
			{#each data.videos as video, i (video.id)}
				<li>
					{#if video.thumbnailUrl}
						<img src={video.thumbnailUrl} alt="" width="120" height="90" />
					{:else}
						<span class="no-thumb" aria-hidden="true"></span>
					{/if}
					<div class="info">
						<strong>{video.title}</strong>
						<span class="meta">{video.published ? 'Öffentlich' : 'Verborgen'}</span>
					</div>
					<form method="POST" use:enhance class="row-actions">
						<input type="hidden" name="id" value={video.id} />
						<button
							class="btn secondary"
							formaction="?/move"
							name="direction"
							value="up"
							disabled={i === 0}
							aria-label="Nach oben">↑</button
						>
						<button
							class="btn secondary"
							formaction="?/move"
							name="direction"
							value="down"
							disabled={i === data.videos.length - 1}
							aria-label="Nach unten">↓</button
						>
						{#if video.published}
							<button class="btn secondary" formaction="?/hide">Verbergen</button>
						{:else}
							<button class="btn" formaction="?/publish">Veröffentlichen</button>
						{/if}
						<button class="btn danger" formaction="?/deleteVideo">Löschen</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<section>
	<div class="head">
		<h2>Diskografie</h2>
		<a class="btn" href="/admin/music/releases/new">Neue Aufnahme</a>
	</div>
	{#if data.releases.length === 0}
		<p class="empty">Noch keine Aufnahmen.</p>
	{:else}
		<ul class="list">
			{#each data.releases as release (release.id)}
				<li>
					{#if release.cover}
						<img src={release.cover.url} alt="" width="90" height="90" />
					{:else}
						<span class="no-thumb square" aria-hidden="true"></span>
					{/if}
					<div class="info">
						<a href="/admin/music/releases/{release.id}"><strong>{release.title}</strong></a>
						<span class="meta">
							{release.artist}{release.year ? `, ${release.year}` : ''}{release.published
								? ''
								: ' (verborgen)'}
						</span>
					</div>
					<a class="btn secondary" href="/admin/music/releases/{release.id}">Bearbeiten</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	section {
		display: grid;
		gap: var(--space-4);
		margin-bottom: var(--space-12);
	}

	h2 {
		font-size: var(--text-lg);
		font-stretch: var(--stretch-body);
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.add {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--surface);
		border-radius: var(--radius);
	}

	.hint,
	.empty,
	.meta {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.error {
		color: var(--danger);
	}

	.list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) 0;
		border-bottom: 1px solid var(--line);
	}

	.list img,
	.no-thumb {
		width: 7.5rem;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: var(--radius);
		background: var(--surface);
	}

	.square,
	.list li img[width='90'] {
		width: 5.5rem;
		aspect-ratio: 1;
	}

	.info {
		display: grid;
		flex: 1;
		min-width: 12rem;
	}

	.row-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
