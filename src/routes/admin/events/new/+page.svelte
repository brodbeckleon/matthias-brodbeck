<script lang="ts">
	import EventForm from '$lib/components/admin/EventForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Neues Konzert – Website verwalten</title>
</svelte:head>

<h1>Neues Konzert</h1>

<EventForm
	values={form?.values ?? data.values}
	errors={form?.errors}
	submitLabel="Konzert speichern"
/>
