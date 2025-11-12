<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon } from '@lucide/svelte';

	let theme = 'dark';

	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored) theme = stored;
		document.documentElement.setAttribute('data-theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		//document.querySelector('meta[name="theme-color"]')?.setAttribute(
		//    'content',
		//    getComputedStyle(document.documentElement).getPropertyValue('--bg')
		//);
	}
</script>

<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle Theme">
	{#if theme === 'dark'}
		<Sun />
	{:else}
		<Moon />
	{/if}
</button>

<style lang="css">
	.theme-toggle {
		background: none;
		border: none;
		color: var(--text);
		cursor: pointer;
		transition: transform 0.2s;
	}

	.theme-toggle:hover {
		transform: scale(1.15);
	}
</style>
