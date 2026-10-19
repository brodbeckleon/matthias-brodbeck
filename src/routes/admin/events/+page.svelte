<script lang="ts">
	import { enhance } from '$app/forms';
	import { keepFocus } from '$lib/admin/form-helpers';
	import { formatEventDate, formatEventTime } from '$lib/events/format';
	import type { EventRow } from '$lib/server/db/schema';

	let { data, form } = $props();

	const views = $derived([
		{ id: 'kommend', label: 'Kommend', events: data.upcoming },
		{ id: 'entwuerfe', label: 'Entwürfe', events: data.drafts },
		{ id: 'vergangen', label: 'Vergangen', events: data.past }
	]);

	const current = $derived(views.find((view) => view.id === data.view)!);

	const STATUS_LABEL: Record<EventRow['status'], string> = {
		scheduled: '',
		cancelled: 'Abgesagt',
		postponed: 'Verschoben'
	};

	const deletedEvent = $derived(
		form && 'deleted' in form ? data.deleted.find((e) => e.id === form.deleted) : undefined
	);
</script>

<svelte:head>
	<title>Konzerte – Website verwalten</title>
</svelte:head>

<div class="head">
	<h1>Konzerte</h1>
	<a class="btn" href="/admin/events/new">Neues Konzert</a>
</div>

{#if deletedEvent}
	<form class="notice undo" method="POST" action="?/restore" use:enhance={keepFocus}>
		<input type="hidden" name="id" value={deletedEvent.id} />
		<span role="status">«{deletedEvent.title}» wurde gelöscht.</span>
		<button class="btn secondary" type="submit" data-focus-fallback>Rückgängig</button>
	</form>
{/if}

<!-- Links, not tabs: the view survives reloads and form submissions without JavaScript. -->
<nav class="views" aria-label="Konzerte filtern">
	{#each views as view (view.id)}
		<a
			href="?view={view.id}"
			aria-current={view.id === data.view ? 'page' : undefined}
			data-sveltekit-noscroll
		>
			{view.label} <span class="count">{view.events.length}</span>
		</a>
	{/each}
</nav>

{#if current.events.length === 0}
	<p class="empty">Keine Konzerte.</p>
{:else}
	<ul class="list">
		{#each current.events as event (event.id)}
			<li>
				<div class="info">
					<a href="/admin/events/{event.id}" class="title">{event.title}</a>
					<span class="meta">
						{formatEventDate(event.startsAt, 'de-ch', event.timezone)},
						{formatEventTime(event.startsAt, 'de-ch', event.timezone)} – {event.venueName}, {event.city}
					</span>
					{#if STATUS_LABEL[event.status]}
						<span class="status">{STATUS_LABEL[event.status]}</span>
					{/if}
				</div>
				<div class="row-actions">
					<a class="btn secondary" href="/admin/events/{event.id}">Bearbeiten</a>
					<form method="POST" use:enhance={keepFocus}>
						<input type="hidden" name="id" value={event.id} />
						{#if event.published}
							<button class="btn secondary" formaction="?/unpublish">Verbergen</button>
						{:else}
							<button class="btn" formaction="?/publish">Veröffentlichen</button>
						{/if}
						{#if event.status === 'cancelled'}
							<button class="btn secondary" formaction="?/reinstate">Findet doch statt</button>
						{:else}
							<button class="btn secondary" formaction="?/cancel">Absagen</button>
						{/if}
						<button class="btn secondary" formaction="?/duplicate">Duplizieren</button>
						<button class="btn danger" formaction="?/delete">Löschen</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.undo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.views {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
		border-bottom: 1px solid var(--line);
	}

	.views a {
		padding: var(--space-3) var(--space-4);
		border-bottom: 3px solid transparent;
		color: var(--text);
		text-decoration: none;
	}

	.views a[aria-current='page'] {
		border-bottom-color: var(--accent);
		font-weight: 700;
	}

	.count {
		color: var(--text-muted);
	}

	.empty {
		color: var(--text-muted);
	}

	.list {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list li {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4) 0;
		border-bottom: 1px solid var(--line);
	}

	.info {
		display: grid;
		gap: var(--space-1);
	}

	.title {
		color: var(--text);
		font-size: var(--text-lg);
		font-weight: 700;
	}

	.meta {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.status {
		justify-self: start;
		padding: 0 var(--space-2);
		border: 1px solid var(--danger);
		border-radius: var(--radius);
		color: var(--danger);
		font-size: var(--text-sm);
	}

	.row-actions,
	.row-actions form {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
