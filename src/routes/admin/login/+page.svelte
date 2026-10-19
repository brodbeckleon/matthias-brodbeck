<script lang="ts">
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Anmelden – Website verwalten</title>
</svelte:head>

<div class="login">
	<h1>Anmelden</h1>

	{#if !data.configured}
		<p class="notice">
			Es ist noch kein Passwort eingerichtet. Siehe README, Abschnitt «Admin-Passwort».
		</p>
	{/if}

	<form method="POST">
		<div class="field">
			<label for="password">Passwort</label>
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
				aria-invalid={form?.error ? 'true' : undefined}
				aria-describedby={form?.error ? 'login-error' : undefined}
			/>
			{#if form?.error}
				<p class="error" id="login-error" role="alert">{form.error}</p>
			{/if}
		</div>
		<button class="btn" type="submit">Anmelden</button>
	</form>
</div>

<style>
	.login {
		max-width: 24rem;
		margin: var(--space-12) auto 0;
	}

	form {
		display: grid;
		gap: var(--space-4);
	}
</style>
