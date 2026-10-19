<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatEventDate, formatEventTime } from '$lib/events/format';
	import type { EventRow } from '$lib/server/db/schema';

	let { data, form } = $props();

	const tabs = $derived([
		{ id: 'upcoming', label: 'Kommend', events: data.upcoming },
		{ id: 'drafts', label: 'Entwürfe', events: data.drafts },
		{ id: 'past', label: 'Vergangen', events: data.past }
	]);

	let active = $state('upcoming');

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
	<form class="notice undo" method="POST" action="?/restore" use:enhance>
		<input type="hidden" name="id" value={deletedEvent.id} />
		<span>«{deletedEvent.title}» wurde gelöscht.</span>
		<button class="btn secondary" type="submit">Rückgängig</button>
	</form>
{/if}

<div class="tabs" role="tablist" aria-label="Konzerte filtern">
	{#each tabs as tab (tab.id)}
		<button
			type="button"
			role="tab"
			id="tab-{tab.id}"
			aria-selected={active === tab.id}
			aria-controls="panel-{tab.id}"
			onclick={() => (active = tab.id)}
		>
			{tab.label} <span class="count">{tab.events.length}</span>
		</button>
	{/each}
</div>

{#each tabs as tab (tab.id)}
	<div
		role="tabpanel"
		id="panel-{tab.id}"
		aria-labelledby="tab-{tab.id}"
		hidden={active !== tab.id}
	>
		{#if tab.events.length === 0}
			<p class="empty">Keine Konzerte.</p>
		{:else}
			<ul class="list">
				{#each tab.events as event (event.id)}
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
							<form method="POST" use:enhance>
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
	</div>
{/each}

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

	.tabs {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
		border-bottom: 1px solid var(--line);
	}

	[role='tab'] {
		padding: var(--space-3) var(--space-4);
		background: none;
		border: 0;
		border-bottom: 3px solid transparent;
		cursor: pointer;
	}

	[role='tab'][aria-selected='true'] {
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
