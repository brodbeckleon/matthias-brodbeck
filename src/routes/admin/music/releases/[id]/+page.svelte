<script lang="ts">
	import { confirmDelete } from '$lib/admin/form-helpers';
	import ReleaseForm from '$lib/components/admin/ReleaseForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Aufnahme bearbeiten – Website verwalten</title>
</svelte:head>

<h1>Aufnahme bearbeiten</h1>

<ReleaseForm
	values={form?.values ?? data.values}
	errors={form?.errors}
	photos={data.photos}
	submitLabel="Änderungen speichern"
/>

<form method="POST" action="?/delete" class="delete">
	<button
		class="btn danger"
		type="submit"
		onclick={confirmDelete('Diese Aufnahme endgültig löschen?')}>Aufnahme löschen</button
	>
</form>

<style>
	.delete {
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		border-top: 1px solid var(--line);
	}
</style>
