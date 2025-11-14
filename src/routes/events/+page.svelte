<script lang="ts">
	import { onMount } from 'svelte';
	import EventScrollpane from '../../components/EventScrollpane.svelte';
	import type { Event } from '../../components/EventScrollpane.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let events: Event[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const res = await fetch('http://localhost:8080/events');
			if (!res.ok) throw new Error('Failed to load events');
			events = await res.json();
		} catch (err) {
			console.error(err);
			error = 'Could not load events.';
		} finally {
			loading = false;
		}
	});
</script>

<div class="events-page">
	<h1>{m.events()}</h1>
	<h4>{m.past_and_upcoming_events()}</h4>

	{#if loading}
		<p>{m.loading()}</p>
	{:else if error}
		<p class="error">{m.error()}</p>
	{:else}
		<EventScrollpane {events} />
	{/if}
</div>

<style lang="css">
	.events-page {
		margin: 0;
		height: 100%;
		overflow: hidden;
		flex: 1;
	}
</style>
