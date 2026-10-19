<script lang="ts">
	import { confirmDelete } from '$lib/admin/form-helpers';

	let { data, form } = $props();

	const photo = $derived(data.photo);
	// After a failed save, show what was typed rather than what is stored.
	const values = $derived(
		form?.values ?? {
			altDe: photo.alt['de-ch'] ?? '',
			altEn: photo.alt.en ?? '',
			altJa: photo.alt.ja ?? '',
			credit: photo.credit ?? '',
			published: photo.published
		}
	);
</script>

<svelte:head>
	<title>Foto bearbeiten – Website verwalten</title>
</svelte:head>

<p><a href="/admin/photos">Alle Fotos</a></p>
<h1>Foto bearbeiten</h1>

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
				<input
					id="altDe"
					name="altDe"
					value={values.altDe}
					lang="de-CH"
					aria-invalid={form?.field === 'altDe' ? 'true' : undefined}
					aria-describedby={form?.field === 'altDe' ? 'altDe-error' : undefined}
				/>
				{#if form?.field === 'altDe'}<p class="error" id="altDe-error" role="alert">
						{form.error}
					</p>{/if}
			</div>
			<div class="field">
				<label for="altEn">Bildbeschreibung Englisch</label>
				<input id="altEn" name="altEn" value={values.altEn} lang="en" />
			</div>
			<div class="field">
				<label for="altJa">Bildbeschreibung Japanisch</label>
				<input id="altJa" name="altJa" value={values.altJa} lang="ja" />
			</div>
			<div class="field">
				<label for="credit">Foto von</label>
				<input id="credit" name="credit" value={values.credit} />
			</div>
			<label class="check">
				<input type="checkbox" name="published" checked={values.published} />
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
			<button
				class="btn danger"
				formaction="?/delete"
				onclick={confirmDelete('Dieses Foto endgültig löschen?')}>Foto löschen</button
			>
		</form>
		{#if form?.error && form.field !== 'altDe'}
			<p class="form-error" role="alert">{form.error}</p>
		{/if}
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
