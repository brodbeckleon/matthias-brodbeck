<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { localizePath } from '$lib/i18n/href';
	import {
		CONTACT_TOPICS,
		type ContactErrorKey,
		type ContactFields,
		type ContactTopic
	} from '$lib/contact/form';

	type FormState = {
		sent?: boolean;
		values?: Record<ContactFields, string>;
		errors?: Partial<Record<ContactFields, ContactErrorKey>>;
		error?: ContactErrorKey;
	} | null;

	type Props = { topic: ContactTopic; turnstileSiteKey: string | null; form: FormState };

	let { topic, turnstileSiteKey, form }: Props = $props();

	let submitting = $state(false);

	const values = $derived(form?.values ?? { topic });
	const errors = $derived(form?.errors ?? {});
	const hasErrors = $derived(Object.keys(errors).length > 0);

	const TOPIC_LABELS: Record<ContactTopic, () => string> = {
		booking: m.topic_booking,
		session: m.topic_session,
		lessons: m.topic_lessons,
		press: m.topic_press,
		other: m.topic_other
	};

	const text = (key: ContactErrorKey) => m[key]();

	function describedBy(field: ContactFields, hint?: string) {
		return [errors[field] && `${field}-error`, hint].filter(Boolean).join(' ') || undefined;
	}
</script>

<svelte:head>
	{#if turnstileSiteKey}
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
	{/if}
</svelte:head>

{#if form?.sent}
	<div class="sent" role="status">
		<h2>{m.form_sent_title()}</h2>
		<p>{m.form_sent_text()}</p>
	</div>
{:else}
	<form
		class="contact-form"
		method="POST"
		novalidate
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update({ reset: false });
				submitting = false;
				// A Turnstile token is single-use.
				(window as { turnstile?: { reset(): void } }).turnstile?.reset();
			};
		}}
	>
		<h2>{m.form_heading()}</h2>

		{#if hasErrors || form?.error}
			<p class="summary" role="alert">
				{form?.error ? text(form.error) : m.form_error_summary()}
			</p>
		{/if}

		<div class="field">
			<label for="topic">{m.form_topic()}</label>
			<select id="topic" name="topic" value={values.topic}>
				{#each CONTACT_TOPICS as option (option)}
					<option value={option}>{TOPIC_LABELS[option]()}</option>
				{/each}
			</select>
		</div>

		<div class="row">
			{#each [{ field: 'name', type: 'text', autocomplete: 'name', label: m.form_name() }, { field: 'email', type: 'email', autocomplete: 'email', label: m.form_email() }] as const as input (input.field)}
				<div class="field">
					<label for={input.field}>{input.label}</label>
					<input
						id={input.field}
						name={input.field}
						type={input.type}
						autocomplete={input.autocomplete}
						value={form?.values?.[input.field] ?? ''}
						required
						aria-invalid={errors[input.field] ? 'true' : undefined}
						aria-describedby={describedBy(input.field)}
					/>
					{#if errors[input.field]}
						<p class="error" id="{input.field}-error">{text(errors[input.field]!)}</p>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Shown for bookings only, by CSS, so it also works without JavaScript. -->
		<div class="row booking">
			<div class="field">
				<label for="eventDate">{m.form_event_date()}</label>
				<input
					id="eventDate"
					name="eventDate"
					value={form?.values?.eventDate ?? ''}
					aria-describedby="booking-hint"
				/>
			</div>
			<div class="field">
				<label for="eventLocation">{m.form_event_location()}</label>
				<input
					id="eventLocation"
					name="eventLocation"
					value={form?.values?.eventLocation ?? ''}
					aria-describedby="booking-hint"
				/>
			</div>
			<p class="hint" id="booking-hint">{m.form_booking_hint()}</p>
		</div>

		<div class="field">
			<label for="message">{m.form_message()}</label>
			<textarea
				id="message"
				name="message"
				rows="8"
				required
				aria-invalid={errors.message ? 'true' : undefined}
				aria-describedby={describedBy('message')}>{form?.values?.message ?? ''}</textarea
			>
			{#if errors.message}
				<p class="error" id="message-error">{text(errors.message)}</p>
			{/if}
		</div>

		<!-- Honeypot: hidden from people, irresistible to bots. -->
		<div class="honeypot" aria-hidden="true">
			<label for="website">{m.form_honeypot()}</label>
			<input id="website" name="website" tabindex="-1" autocomplete="off" />
		</div>

		{#if turnstileSiteKey}
			<div class="cf-turnstile" data-sitekey={turnstileSiteKey} data-language={getLocale()}></div>
		{/if}

		<p class="privacy">
			{m.form_privacy()}
			<a href={localizePath('/privacy')}>{m.form_privacy_link()}</a>
		</p>

		<div>
			<button type="submit" disabled={submitting}>
				{submitting ? m.form_sending() : m.form_send()}
			</button>
		</div>
	</form>
{/if}

<style>
	.contact-form {
		display: grid;
		gap: var(--space-6);
		max-width: 40rem;
	}

	h2 {
		font-size: var(--text-h3);
	}

	.summary {
		padding: var(--space-3) var(--space-4);
		border-left: 3px solid var(--danger);
		background: var(--surface);
	}

	.row {
		display: grid;
		gap: var(--space-6);
	}

	@media (min-width: 40rem) {
		.row {
			grid-template-columns: 1fr 1fr;
		}
	}

	.booking {
		display: none;
	}

	.contact-form:has(option[value='booking']:checked) .booking {
		display: grid;
	}

	.hint {
		grid-column: 1 / -1;
		margin-top: calc(-1 * var(--space-4));
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.field {
		display: grid;
		gap: var(--space-2);
	}

	label {
		font-weight: 600;
	}

	input,
	select,
	textarea {
		width: 100%;
		min-height: 3rem;
		padding: var(--space-2) var(--space-3);
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--text);
		font: inherit;
	}

	textarea {
		resize: vertical;
	}

	[aria-invalid='true'] {
		border-color: var(--danger);
	}

	.error {
		color: var(--danger);
		font-size: var(--text-sm);
	}

	.honeypot {
		position: absolute;
		left: -10000px;
	}

	.privacy {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	button {
		min-height: 3rem;
		padding: 0 var(--space-6);
		background: var(--accent);
		border: 2px solid var(--accent);
		border-radius: var(--radius);
		color: var(--on-accent);
		font-weight: 650;
		cursor: pointer;
	}

	.sent {
		display: grid;
		gap: var(--space-3);
		max-width: 40rem;
		padding: var(--space-8) 0 var(--space-8) var(--space-6);
		border-left: 3px solid var(--accent);
	}
</style>
