<script lang="ts">
	import { Facebook, Instagram, Youtube } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import LanguageDropDown from './LanguageDropDown.svelte';
	import ThemeToggler from './ThemeToggler.svelte';

	const navLinks = [
		{ name: m.home(), href: '/' },
		{ name: m.events(), href: '/events' },
		{ name: m.music(), href: '/music' },
		{ name: m.gallery(), href: '/gallery' },
		{ name: m.contact(), href: '/contact' }
	];

	const socialLinks = [
		{ icon: Facebook, href: 'https://www.facebook.com/matthias.brodbeck.7' },
		{ icon: Instagram, href: 'https://www.instagram.com/brodbeckmatthias/' },
		{ icon: Youtube, href: 'https://www.youtube.com/@matthiasbrodbeck7950' }
	];
</script>

<nav class="navbar">
	<!-- Top Row -->
	<div class="top-row">
		<div class="social-icons">
			{#each socialLinks as { icon, href } (href)}
				<a {href} target="_blank" rel="noopener noreferrer" class="icon-link">
					<svelte:component this={icon} />
				</a>
			{/each}
		</div>

		<a href={'/'} class="title-link" aria-label="Homepage">
			<div class="title-row">
				<div class="title">Matthias Brodbeck</div>
				<div class="tagline">{m.drums_and_percussion()}</div>
			</div>
		</a>

		<div class="settings">
			<ThemeToggler />
			<LanguageDropDown />
		</div>
	</div>
	<!-- Bottom Row -->

	<div class="nav-links">
		{#each navLinks as { name, href } (href)}
			<a {href}>{name}</a>
		{/each}
	</div>
</nav>

<style lang="css">
	.navbar {
		width: 100%;
		background-color: var(--bg);
		color: var(--text);
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	/* Top Row */
	.top-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 10px 20px;
		min-height: 70px;
	}

	.title-link {
		text-decoration: none;
		color: inherit;
	}

	@media (min-width: 600px) {
		.top-row {
			flex-direction: row;
		}
	}

	.social-icons {
		display: flex;
		gap: 15px;
	}

	.icon-link {
		color: var(--text);
		transition: transform 0.2s;
	}

	.icon-link:hover {
		transform: scale(1.2);
	}

	.settings {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.title {
		font-size: 1.8rem;
		font-weight: bolder;
		text-align: center;
	}

	.tagline {
		font-size: 0.9rem;
		color: var(--text-muted);
		text-align: center;
	}

	/* Bottom nav */
	.nav-links {
		display: flex;
		justify-content: center;
		gap: 25px;
		background-color: var(--bg-secondary);
		padding: 8px 0;
		font-weight: 800;
	}

	.nav-links a {
		color: var(--text);
		text-decoration: none;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: var(--accent);
	}

	@media (max-width: 400px) {
		.title {
			font-size: 1.2rem;
		}

		.nav-links {
			flex-direction: column;
			gap: 10px;
		}
	}
</style>
