<script lang="ts">
	import { Menu, X } from '@lucide/svelte';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { localizePath } from '$lib/i18n/href';
	import { deLocalizeHref } from '$lib/paraglide/runtime';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import SocialLinks from './SocialLinks.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/events', label: m.concerts() },
		{ href: '/music', label: m.music() },
		{ href: '/gallery', label: m.gallery() },
		{ href: '/about', label: m.about() },
		{ href: '/teaching', label: m.teaching() },
		{ href: '/contact', label: m.contact() }
	];

	let dialog: HTMLDialogElement;

	const currentPath = $derived(deLocalizeHref(page.url.pathname));

	function isCurrent(href: string) {
		return currentPath === href || currentPath.startsWith(`${href}/`);
	}

	// Close before navigating, so SvelteKit's focus reset afterwards is not undone by the dialog
	// returning focus to the menu button.
	beforeNavigate(() => dialog?.close());
</script>

<header class="site-header">
	<div class="bar">
		<a
			class="name"
			href={localizePath('/')}
			aria-current={currentPath === '/' ? 'page' : undefined}
		>
			Matthias Brodbeck
		</a>

		<nav class="desktop-nav" aria-label={m.main_navigation()}>
			<ul>
				{#each links as link (link.href)}
					<li>
						<a
							href={localizePath(link.href)}
							aria-current={isCurrent(link.href) ? 'page' : undefined}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="tools">
			<LanguageSwitcher />
			<ThemeToggle />
			<button
				type="button"
				class="menu-button"
				aria-haspopup="dialog"
				onclick={() => dialog.showModal()}
			>
				<Menu size={22} aria-hidden="true" />
				<span class="visually-hidden">{m.menu()}</span>
			</button>
		</div>
	</div>
</header>

<dialog class="mobile-menu" bind:this={dialog} aria-label={m.menu()}>
	<div class="dialog-bar">
		<span class="name">Matthias Brodbeck</span>
		<button type="button" class="menu-button" onclick={() => dialog.close()}>
			<X size={22} aria-hidden="true" />
			<span class="visually-hidden">{m.close_menu()}</span>
		</button>
	</div>
	<nav aria-label={m.main_navigation()}>
		<ul>
			<li>
				<a href={localizePath('/')} aria-current={currentPath === '/' ? 'page' : undefined}>
					{m.home()}
				</a>
			</li>
			{#each links as link (link.href)}
				<li>
					<a
						href={localizePath(link.href)}
						aria-current={isCurrent(link.href) ? 'page' : undefined}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<SocialLinks />
</dialog>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--bg);
		border-bottom: 1px solid var(--line);
	}

	.bar,
	.dialog-bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		max-width: var(--content-max);
		min-height: 4rem;
		margin: 0 auto;
		padding: 0 var(--gutter);
	}

	.name {
		min-width: 0;
		margin-right: auto;
		color: var(--text);
		font-size: clamp(1.125rem, 0.6rem + 2.5vw, 1.5rem);
		font-stretch: var(--stretch-display);
		font-weight: 800;
		letter-spacing: -0.01em;
		text-decoration: none;
		white-space: nowrap;
	}

	.desktop-nav {
		display: none;
	}

	.desktop-nav ul {
		display: flex;
		gap: var(--space-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.desktop-nav a {
		position: relative;
		display: flex;
		align-items: center;
		height: 4rem;
		color: var(--text);
		text-decoration: none;
		white-space: nowrap;
	}

	.desktop-nav a:hover {
		color: var(--accent-ink);
	}

	/* Current page: a brass bar sitting on the header's bottom rule. */
	.desktop-nav a[aria-current='page']::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		height: 3px;
		background: var(--accent-ink);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.menu-button {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: none;
		border: 0;
		border-radius: var(--radius);
		cursor: pointer;
	}

	@media (min-width: 64rem) {
		.bar {
			gap: var(--space-6);
		}

		.desktop-nav {
			display: block;
		}

		.tools .menu-button {
			display: none;
		}
	}

	.mobile-menu {
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		margin: 0;
		padding: 0 0 var(--space-8);
		background: var(--bg);
		color: var(--text);
		border: 0;
	}

	.mobile-menu::backdrop {
		background: var(--bg);
	}

	.mobile-menu nav,
	.mobile-menu > :global(.social) {
		padding: 0 var(--gutter);
	}

	.mobile-menu nav ul {
		display: grid;
		gap: var(--space-1);
		margin: var(--space-8) 0;
		padding: 0;
		list-style: none;
	}

	.mobile-menu nav a {
		color: var(--text);
		font-size: 2.75rem;
		font-stretch: var(--stretch-display);
		font-weight: 750;
		line-height: 1.1;
		text-decoration: none;
	}

	.mobile-menu nav a[aria-current='page'] {
		color: var(--accent-ink);
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 0.15em;
	}
</style>
