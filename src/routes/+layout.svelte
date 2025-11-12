<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '../components/Navigation.svelte';
	import '../global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#111" />
</svelte:head>

<Navigation />

{@render children()}
