<script lang="ts">
	import type { EventFormErrors, EventFormValues } from '$lib/events/form';

	type Props = {
		values: EventFormValues;
		errors?: EventFormErrors;
		submitLabel: string;
	};

	let { values, errors = {}, submitLabel }: Props = $props();

	const TIME_ZONES = [
		'Europe/Zurich',
		'Europe/Berlin',
		'Europe/London',
		'Asia/Tokyo',
		'America/New_York'
	];
</script>

{#snippet field(
	name: keyof EventFormValues,
	label: string,
	options: { type?: string; required?: boolean; hint?: string } = {}
)}
	<div class="field">
		<label for={name}>{label}{options.required ? ' *' : ''}</label>
		<input
			id={name}
			{name}
			type={options.type ?? 'text'}
			value={values[name]}
			required={options.required}
			autocomplete="off"
			aria-invalid={errors[name] ? 'true' : undefined}
			aria-describedby={errors[name] ? `${name}-error` : options.hint ? `${name}-hint` : undefined}
		/>
		{#if options.hint}<p class="hint" id="{name}-hint">{options.hint}</p>{/if}
		{#if errors[name]}<p class="error" id="{name}-error">{errors[name]}</p>{/if}
	</div>
{/snippet}

{#snippet textarea(name: keyof EventFormValues, label: string, lang: string)}
	<div class="field">
		<label for={name}>{label}</label>
		<textarea
			id={name}
			{name}
			rows="4"
			maxlength="4000"
			{lang}
			aria-invalid={errors[name] ? 'true' : undefined}
			aria-describedby={errors[name] ? `${name}-error` : undefined}>{values[name]}</textarea
		>
		{#if errors[name]}<p class="error" id="{name}-error">{errors[name]}</p>{/if}
	</div>
{/snippet}

<form method="POST" action="?/save" class="event-form">
	{#if Object.keys(errors).length}
		<p class="form-error" role="alert">Bitte die markierten Felder prüfen.</p>
	{/if}

	<fieldset>
		<legend>Konzert</legend>
		{@render field('title', 'Titel', {
			required: true,
			hint: 'Zum Beispiel der Bandname oder das Programm.'
		})}
		{@render field('lineup', 'Besetzung', {
			hint: 'Zum Beispiel: Anna Muster (p), Matthias Brodbeck (dr)'
		})}
	</fieldset>

	<fieldset>
		<legend>Datum und Zeit</legend>
		<div class="row">
			{@render field('date', 'Datum', { type: 'date', required: true })}
			{@render field('startTime', 'Beginn', { type: 'time', required: true })}
			{@render field('endTime', 'Ende', { type: 'time', hint: 'Optional.' })}
		</div>
		<div class="field">
			<label for="timezone">Zeitzone</label>
			<select
				id="timezone"
				name="timezone"
				value={values.timezone}
				aria-invalid={errors.timezone ? 'true' : undefined}
				aria-describedby={errors.timezone ? 'timezone-error' : undefined}
			>
				{#each TIME_ZONES.includes(values.timezone) ? TIME_ZONES : [values.timezone, ...TIME_ZONES] as zone (zone)}
					<option value={zone}>{zone}</option>
				{/each}
			</select>
			{#if errors.timezone}<p class="error" id="timezone-error">{errors.timezone}</p>{/if}
		</div>
	</fieldset>

	<fieldset>
		<legend>Ort</legend>
		{@render field('venueName', 'Lokal oder Saal', { required: true })}
		{@render field('street', 'Strasse')}
		<div class="row">
			{@render field('postalCode', 'PLZ')}
			{@render field('city', 'Stadt', { required: true })}
			{@render field('country', 'Land', { required: true, hint: 'CH, DE, JP …' })}
		</div>
		{@render field('venueUrl', 'Website des Lokals', { type: 'url' })}
		{@render field('ticketUrl', 'Link zu Tickets', { type: 'url' })}
	</fieldset>

	<fieldset>
		<legend>Beschreibung</legend>
		<p class="hint">
			Deutsch genügt. Fehlt eine Übersetzung, zeigt die Website den deutschen Text (auf Japanisch
			zuerst den englischen, falls vorhanden).
		</p>
		{@render textarea('descriptionDe', 'Deutsch', 'de-CH')}
		{@render textarea('descriptionEn', 'Englisch', 'en')}
		{@render textarea('descriptionJa', 'Japanisch', 'ja')}
	</fieldset>

	<fieldset>
		<legend>Status</legend>
		<div class="field">
			<label for="status">Status</label>
			<select id="status" name="status" value={values.status}>
				<option value="scheduled">Findet statt</option>
				<option value="postponed">Verschoben</option>
				<option value="cancelled">Abgesagt</option>
			</select>
		</div>
		<label class="check">
			<input type="checkbox" name="published" checked={values.published === 'on'} />
			Auf der Website anzeigen
		</label>
	</fieldset>

	<div class="actions">
		<button class="btn" type="submit">{submitLabel}</button>
		<a class="btn secondary" href="/admin/events">Abbrechen</a>
	</div>
</form>

<style>
	.event-form {
		display: grid;
		gap: var(--space-8);
	}

	fieldset {
		display: grid;
		gap: var(--space-4);
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		margin-bottom: var(--space-4);
		font-size: var(--text-lg);
		font-weight: 700;
	}

	.row {
		display: grid;
		gap: var(--space-4);
	}

	@media (min-width: 40rem) {
		.row {
			grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
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
		gap: var(--space-3);
	}
</style>
