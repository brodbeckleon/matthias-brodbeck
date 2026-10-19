<script lang="ts">
	import { page } from '$app/state';

	let { data, children } = $props();

	const links = $derived([
		{ href: '/admin', label: 'Übersicht' },
		{ href: '/admin/events', label: 'Konzerte' },
		{ href: '/admin/photos', label: 'Fotos' },
		{ href: '/admin/messages', label: data.unread ? `Nachrichten (${data.unread})` : 'Nachrichten' }
	]);

	function isCurrent(href: string) {
		const path = page.url.pathname;
		return href === '/admin' ? path === '/admin' : path.startsWith(href);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin" lang="de-CH">
	<header>
		<div class="bar">
			<a class="brand" href="/admin">Website verwalten</a>
			{#if data.loggedIn}
				<nav aria-label="Verwaltung">
					{#each links as link (link.href)}
						<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
							{link.label}
						</a>
					{/each}
				</nav>
				<div class="session">
					<a href="/" target="_blank" rel="noopener">Website ansehen</a>
					<form method="POST" action="/admin/logout">
						<button type="submit">Abmelden</button>
					</form>
				</div>
			{/if}
		</div>
	</header>
	<main id="main">
		{@render children()}
	</main>
</div>

<style>
	.admin {
		min-height: 100vh;
		font-stretch: var(--stretch-body);
	}

	header {
		background: var(--surface);
		border-bottom: 1px solid var(--line);
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-6);
		max-width: 60rem;
		margin: 0 auto;
		padding: var(--space-3) var(--gutter);
	}

	.brand {
		color: var(--text);
		font-weight: 700;
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: var(--space-4);
	}

	nav a {
		color: var(--text);
		text-decoration: none;
		padding: var(--space-2) 0;
		border-bottom: 2px solid transparent;
	}

	nav a[aria-current='page'] {
		border-bottom-color: var(--accent);
	}

	.session {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-left: auto;
		font-size: var(--text-sm);
	}

	.session button {
		padding: var(--space-2) var(--space-3);
		background: none;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		cursor: pointer;
	}

	main {
		max-width: 60rem;
		margin: 0 auto;
		padding: var(--space-8) var(--gutter) var(--space-16);
	}

	/* Shared admin form and table styles. */
	main :global(h1) {
		margin-bottom: var(--space-6);
		font-size: 2rem;
		font-stretch: var(--stretch-body);
		line-height: 1.2;
	}

	main :global(.field) {
		display: grid;
		gap: var(--space-1);
	}

	main :global(.field input),
	main :global(.field select),
	main :global(.field textarea) {
		width: 100%;
		min-height: 2.75rem;
		padding: var(--space-2) var(--space-3);
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--text);
		font: inherit;
	}

	main :global(.field :is(input, select, textarea)[aria-invalid='true']) {
		border-color: var(--danger);
	}

	main :global(.field .hint) {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	main :global(.field .error),
	main :global(.form-error) {
		color: var(--danger);
		font-size: var(--text-sm);
	}

	main :global(.btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: 2.75rem;
		padding: 0 var(--space-4);
		background: var(--accent);
		border: 1px solid var(--accent);
		border-radius: var(--radius);
		color: var(--on-accent);
		font-weight: 650;
		text-decoration: none;
		cursor: pointer;
	}

	main :global(.btn.secondary) {
		background: transparent;
		border-color: var(--line);
		color: var(--text);
	}

	main :global(.btn.danger) {
		background: transparent;
		border-color: var(--danger);
		color: var(--danger);
	}

	main :global(.notice) {
		margin-bottom: var(--space-6);
		padding: var(--space-3) var(--space-4);
		background: var(--surface);
		border-left: 3px solid var(--accent);
	}
</style>
