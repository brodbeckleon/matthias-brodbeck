<script lang="ts">
	import { formatEventDate, formatEventTime } from '$lib/events/format';

	let { data } = $props();

	const TOPIC_LABEL = {
		booking: 'Konzertanfrage',
		session: 'Studioaufnahme',
		lessons: 'Unterricht',
		press: 'Presse',
		other: 'Anderes'
	} as const;
</script>

<svelte:head>
	<title>Nachrichten – Website verwalten</title>
</svelte:head>

<h1>Nachrichten</h1>

<nav class="views" aria-label="Ansicht">
	<a href="/admin/messages" aria-current={data.archived ? undefined : 'page'}>Posteingang</a>
	<a href="/admin/messages?view=archiv" aria-current={data.archived ? 'page' : undefined}>Archiv</a>
</nav>

{#if data.messages.length === 0}
	<p class="empty">Keine Nachrichten.</p>
{:else}
	<ul class="list">
		{#each data.messages as message (message.id)}
			<li class:unread={message.status === 'new'}>
				<!-- No preloading: opening a message marks it read, hovering must not. -->
				<a href="/admin/messages/{message.id}" data-sveltekit-preload-data="off">
					<span class="from">
						{#if message.status === 'new'}<span class="dot">Neu</span>{/if}
						{message.name}
					</span>
					<span class="topic">{TOPIC_LABEL[message.topic]}</span>
					<span class="preview">{message.message.slice(0, 140)}</span>
					<span class="date">
						{formatEventDate(message.createdAt, 'de-ch', 'Europe/Zurich')},
						{formatEventTime(message.createdAt, 'de-ch', 'Europe/Zurich')}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<p class="retention">Nachrichten werden nach zwölf Monaten automatisch gelöscht.</p>

<style>
	.views {
		display: flex;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.views a {
		color: var(--text);
		text-decoration: none;
		padding: var(--space-2) 0;
		border-bottom: 2px solid transparent;
	}

	.views a[aria-current='page'] {
		border-bottom-color: var(--accent);
		font-weight: 700;
	}

	.list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list a {
		display: grid;
		gap: var(--space-1);
		padding: var(--space-4) 0;
		border-bottom: 1px solid var(--line);
		color: var(--text);
		text-decoration: none;
	}

	.list a:hover .from {
		color: var(--accent-ink);
	}

	.from {
		font-weight: 600;
	}

	.unread .from {
		font-weight: 800;
	}

	.dot {
		margin-right: var(--space-2);
		padding: 0 var(--space-2);
		background: var(--accent);
		border-radius: var(--radius);
		color: var(--on-accent);
		font-size: var(--text-sm);
	}

	.topic,
	.date,
	.retention,
	.empty {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.preview {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.retention {
		margin-top: var(--space-8);
	}
</style>
