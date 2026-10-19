<script lang="ts">
	import EventForm from '$lib/components/admin/EventForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Konzert bearbeiten – Website verwalten</title>
</svelte:head>

<h1>Konzert bearbeiten</h1>

{#if data.published}
	<p class="notice">
		Öffentlich unter <a href="/events/{data.slug}" target="_blank" rel="noopener"
			>/events/{data.slug}</a
		>
	</p>
{/if}

<EventForm
	values={form?.values ?? data.values}
	errors={form?.errors}
	submitLabel="Änderungen speichern"
/>
