<script lang="ts">
	import ReleaseForm from '$lib/components/admin/ReleaseForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Neue Aufnahme – Website verwalten</title>
</svelte:head>

<h1>Neue Aufnahme</h1>

<ReleaseForm
	values={form?.values ?? data.values}
	errors={form?.errors}
	photos={data.photos}
	submitLabel="Aufnahme speichern"
/>
