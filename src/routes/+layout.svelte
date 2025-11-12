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
<div class="container">
	{@render children()}
</div>

<style>
	.container {
		margin: 0 auto;
		width: 50vw;
	}

	@media (max-width: 599px) {
		.container {
			width: 95vw;
		}
	}

	@media (min-width: 600px) {
		.container {
			width: 90vw;
		}
	}

	@media (min-width: 900px) {
		.container {
			width: 70vw;
		}
	}
</style>
