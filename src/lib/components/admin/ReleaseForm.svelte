<script lang="ts">
	import type { ReleaseFormErrors, ReleaseFormValues } from '$lib/music/release-form';

	type Props = {
		values: ReleaseFormValues;
		errors?: ReleaseFormErrors;
		photos: { id: number; label: string }[];
		submitLabel: string;
	};

	let { values, errors = {}, photos, submitLabel }: Props = $props();
</script>

{#snippet input(name: keyof ReleaseFormValues, label: string, hint?: string)}
	<div class="field">
		<label for={name}>{label}</label>
		<input
			id={name}
			{name}
			value={values[name]}
			aria-invalid={errors[name] ? 'true' : undefined}
			aria-describedby={[errors[name] && `${name}-error`, hint && `${name}-hint`]
				.filter(Boolean)
				.join(' ') || undefined}
		/>
		{#if hint}<p class="hint" id="{name}-hint">{hint}</p>{/if}
		{#if errors[name]}<p class="error" id="{name}-error">{errors[name]}</p>{/if}
	</div>
{/snippet}

<form method="POST" action="?/save" class="release-form">
	{#if Object.keys(errors).length}
		<p class="form-error" role="alert">Bitte die markierten Felder prüfen.</p>
	{/if}

	{@render input('title', 'Titel *')}
	{@render input('artist', 'Band oder Künstler *')}
	<div class="row">
		{@render input('year', 'Jahr')}
		{@render input('label', 'Label')}
	</div>
	{@render input('role', 'Instrumente', 'Zum Beispiel: Schlagzeug, Perkussion')}

	<div class="field">
		<label for="coverMediaId">Cover</label>
		<select
			id="coverMediaId"
			name="coverMediaId"
			value={values.coverMediaId}
			aria-describedby="cover-hint"
		>
			<option value="">Kein Cover</option>
			{#each photos as photo (photo.id)}
				<option value={String(photo.id)}>{photo.label}</option>
			{/each}
		</select>
		<p class="hint" id="cover-hint">Das Cover zuerst unter «Fotos» hochladen.</p>
	</div>

	<div class="field">
		<label for="links">Links</label>
		<textarea
			id="links"
			name="links"
			rows="3"
			aria-invalid={errors.links ? 'true' : undefined}
			aria-describedby="links-hint{errors.links ? ' links-error' : ''}">{values.links}</textarea
		>
		<p class="hint" id="links-hint">Eine Zeile pro Link, z. B. «Bandcamp | https://…».</p>
		{#if errors.links}<p class="error" id="links-error">{errors.links}</p>{/if}
	</div>

	<div class="field">
		<label for="embed">Player zum Einbetten</label>
		<textarea
			id="embed"
			name="embed"
			rows="3"
			aria-invalid={errors.embed ? 'true' : undefined}
			aria-describedby="embed-hint{errors.embed ? ' embed-error' : ''}">{values.embed}</textarea
		>
		<p class="hint" id="embed-hint">
			Optional: den «Einbetten»-Code von Bandcamp oder SoundCloud hier einfügen.
		</p>
		{#if errors.embed}<p class="error" id="embed-error">{errors.embed}</p>{/if}
	</div>

	<label class="check">
		<input type="checkbox" name="published" checked={values.published === 'on'} />
		Auf der Website anzeigen
	</label>

	<div class="actions">
		<button class="btn" type="submit">{submitLabel}</button>
		<a class="btn secondary" href="/admin/music">Abbrechen</a>
	</div>
</form>

<style>
	.release-form {
		display: grid;
		gap: var(--space-4);
		max-width: 40rem;
	}

	.row {
		display: grid;
		gap: var(--space-4);
	}

	@media (min-width: 40rem) {
		.row {
			grid-template-columns: 1fr 2fr;
		}
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
</style>
