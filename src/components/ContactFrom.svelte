<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	let name = '';
	let email = '';
	let message = '';
	let success = false;
	let error = '';

	async function handleSubmit(e: Event) {
		e.preventDefault();
		success = false;
		error = '';

		try {
			const res = await fetch('http://localhost:8080/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message })
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
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="contact-form">
	<h2>{m.contact_me()}</h2>

	<label>
		{m.name()}
		<input type="text" bind:value={name} required />
	</label>

	<label>
		{m.email()}
		<input type="email" bind:value={email} required />
	</label>

	<label>
		{m.message()}
		<textarea bind:value={message} required rows="5"></textarea>
	</label>

	<button type="submit">{m.send()}</button>

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
	}

	button {
		background: var(--accent, #007bff);
		color: white;
		padding: 0.5rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		width: 100%;
	}
</style>
