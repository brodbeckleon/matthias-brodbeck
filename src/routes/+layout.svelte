<script lang="ts">
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import favicon32x32 from '$lib/assets/favicon-32x32.png';
	import favicon16x16 from '$lib/assets/favicon-16x16.png';
	import siteWebmanifest from '$lib/assets/site.webmanifest';
	import Navigation from '../components/Navigation.svelte';
	import '../global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={favicon32x32} />
	<link rel="icon" type="image/png" sizes="16x16" href={favicon16x16} />
	<link rel="manifest" href={siteWebmanifest} />
</svelte:head>

<div class="layout">
	<div class="topbar">
		<Navigation />
	</div>
	<div class="container">
		{@render children()}
	</div>
</div>

<style lang="css">
	.layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.topbar {
		position: sticky; /* or fixed */
		top: 0;
		z-index: 100;
		background: var(--bg); /* ensure same background */
	}

	.container {
		flex: 1;
		overflow-y: auto; /* Only this scrolls */
		margin: 0 auto;
		width: 50vw;
		padding-bottom: 2rem;
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
