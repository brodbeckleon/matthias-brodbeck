<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';

	function effectiveTheme(): 'light' | 'dark' {
		const chosen = document.documentElement.dataset.theme;
		if (chosen === 'light' || chosen === 'dark') return chosen;
		return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}

	function toggle() {
		const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		// Keep the mobile browser toolbar in step (both media variants, since the choice overrides the OS).
		for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
			meta.content = next === 'light' ? '#ebe7e0' : '#17130f';
		}
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage can be unavailable (private mode); the choice then lasts for this page only.
		}
	}
</script>

<!-- Both icons are rendered and CSS picks one, so server and client HTML always match. -->
<button type="button" class="theme-toggle" onclick={toggle} aria-label={m.toggle_theme()}>
	<Sun class="icon-sun" size={20} aria-hidden="true" />
	<Moon class="icon-moon" size={20} aria-hidden="true" />
</button>

<style>
	.theme-toggle {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: none;
		border: 0;
		border-radius: var(--radius);
		color: var(--text);
		cursor: pointer;
	}

	.theme-toggle:hover {
		color: var(--accent-ink);
	}

	.theme-toggle :global(.icon-moon) {
		display: none;
	}

	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .theme-toggle :global(.icon-sun) {
			display: none;
		}

		:global(:root:not([data-theme='dark'])) .theme-toggle :global(.icon-moon) {
			display: block;
		}
	}

	:global(:root[data-theme='light']) .theme-toggle :global(.icon-sun) {
		display: none;
	}

	:global(:root[data-theme='light']) .theme-toggle :global(.icon-moon) {
		display: block;
	}
</style>
