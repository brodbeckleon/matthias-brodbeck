<script lang="ts">
	let { data, form } = $props();

	const photo = $derived(data.photo);
</script>

<svelte:head>
	<title>Foto bearbeiten – Website verwalten</title>
</svelte:head>

<p><a href="/admin/photos">Alle Fotos</a></p>
<h1>Foto bearbeiten</h1>

{#if form?.error}
	<p class="form-error" role="alert">{form.error}</p>
{/if}

<div class="layout">
	<img src={photo.url} alt={photo.alt['de-ch'] ?? ''} width={photo.width} height={photo.height} />

	<div>
		<form method="POST" action="?/save" class="fields">
			<p class="hint">
				Die Bildbeschreibung wird blinden Besucherinnen und Besuchern vorgelesen. Beschreiben Sie,
				was zu sehen ist, z. B. «Matthias Brodbeck am Schlagzeug, Moods Zürich».
			</p>
			<div class="field">
				<label for="altDe">Bildbeschreibung Deutsch *</label>
				<input id="altDe" name="altDe" value={photo.alt['de-ch'] ?? ''} lang="de-CH" />
			</div>
			<div class="field">
				<label for="altEn">Bildbeschreibung Englisch</label>
				<input id="altEn" name="altEn" value={photo.alt.en ?? ''} lang="en" />
			</div>
			<div class="field">
				<label for="altJa">Bildbeschreibung Japanisch</label>
				<input id="altJa" name="altJa" value={photo.alt.ja ?? ''} lang="ja" />
			</div>
			<div class="field">
				<label for="credit">Foto von</label>
				<input id="credit" name="credit" value={photo.credit ?? ''} />
			</div>
			<label class="check">
				<input type="checkbox" name="published" checked={photo.published} />
				In der Galerie zeigen
			</label>
			<div class="actions">
				<button class="btn" type="submit">Speichern</button>
			</div>
		</form>

		<form method="POST" class="actions secondary-actions">
			<button class="btn secondary" formaction="?/portrait" disabled={!photo.published}>
				{photo.portrait ? 'Nicht mehr als Porträt verwenden' : 'Als Porträt auf der Startseite'}
			</button>
			<button class="btn danger" formaction="?/delete">Foto löschen</button>
		</form>
	</div>
</div>

<style>
	.layout {
		display: grid;
		gap: var(--space-8);
	}

	@media (min-width: 48rem) {
		.layout {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	img {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}

	.fields {
		display: grid;
		gap: var(--space-4);
	}

	.hint {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.check {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 2.75rem;
	}

	.check input {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: var(--accent);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.secondary-actions {
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		border-top: 1px solid var(--line);
	}
</style>
