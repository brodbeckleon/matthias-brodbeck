<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { z } from 'zod';

	const contactFormSchema = z.object({
		name: z.string().min(1, m.name_required()),
		email: z.email(m.invalid_email()),
		message: z.string().min(1, m.message_required())
	});

	type ContactFormData = z.infer<typeof contactFormSchema>;

	let name = '';
	let email = '';
	let message = '';

	let success = false;
	let error = '';
	let submitting = false;

	let fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};

	async function handleSubmit(e: Event) {
		e.preventDefault();
		success = false;
		error = '';
		fieldErrors = {};
		submitting = true;

		const formData: ContactFormData = { name, email, message };
		const validation = contactFormSchema.safeParse(formData);

		if (!validation.success) {
			validation.error.issues.forEach((err) => {
				const key = err.path[0] as keyof ContactFormData;
				fieldErrors[key] = err.message;
			});
			submitting = false;
			return;
		}

		try {
			const res = await fetch('http://localhost:8080/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (res.ok) {
				success = true;
				name = email = message = '';
			} else {
				const data = await res.json();
				error = data.error || m.failed_to_send_message();
			}
		} catch (err) {
			error = m.network_error();
			console.error(err);
		} finally {
			submitting = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="contact-form">
	<h2>{m.contact_me()}</h2>

	<label>
		{m.name()}
		<input type="text" bind:value={name} />
		{#if fieldErrors.name}
			<span class="error">{fieldErrors.name}</span>
		{/if}
	</label>

	<label>
		{m.email()}
		<input type="email" bind:value={email} />
		{#if fieldErrors.email}
			<span class="error">{fieldErrors.email}</span>
		{/if}
	</label>

	<label>
		{m.message()}
		<textarea bind:value={message} rows="5"></textarea>
		{#if fieldErrors.message}
			<span class="error">{fieldErrors.message}</span>
		{/if}
	</label>

	<button class="submit-button" type="submit" disabled={submitting}>
		{submitting ? 'Sending...' : m.send()}
	</button>

	{#if success}
		<p class="success">{m.message_sent_successfully()}</p>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}
</form>

<style>
	.contact-form {
		display: flex;
		flex-direction: column;
		max-width: 50vw;
		margin: 0 auto;
		gap: 0.75rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
		box-sizing: border-box;
	}

    textarea {
        height: 30vh;
        resize: none;
    }

	.submit-button {
		background: var(--accent, #007bff);
		color: white;
		padding: 0.5rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		width: 100%;
	}
</style>
