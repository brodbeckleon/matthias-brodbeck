<script lang="ts">
	import { formatEventDate, formatEventTime } from '$lib/events/format';

	let { data } = $props();

	const message = $derived(data.message);

	const TOPIC_LABEL = {
		booking: 'Konzertanfrage',
		session: 'Studioaufnahme',
		lessons: 'Unterricht',
		press: 'Presse',
		other: 'Anderes'
	} as const;

	const LANGUAGE = { en: 'Englisch', 'de-ch': 'Deutsch', ja: 'Japanisch' } as Record<
		string,
		string
	>;

	const replyHref = $derived(
		`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${TOPIC_LABEL[message.topic]}`)}`
	);
</script>

<svelte:head>
	<title>Nachricht von {message.name} – Website verwalten</title>
</svelte:head>

<p><a href="/admin/messages">Alle Nachrichten</a></p>

<h1>{message.name}</h1>

<dl>
	<dt>Thema</dt>
	<dd>{TOPIC_LABEL[message.topic]}</dd>
	<dt>E-Mail</dt>
	<dd><a href="mailto:{message.email}">{message.email}</a></dd>
	{#if message.eventDate}
		<dt>Datum</dt>
		<dd>{message.eventDate}</dd>
	{/if}
	{#if message.eventLocation}
		<dt>Ort</dt>
		<dd>{message.eventLocation}</dd>
	{/if}
	<dt>Eingegangen</dt>
	<dd>
		{formatEventDate(message.createdAt, 'de-ch', 'Europe/Zurich')},
		{formatEventTime(message.createdAt, 'de-ch', 'Europe/Zurich')}
	</dd>
	<dt>Sprache</dt>
	<dd>{LANGUAGE[message.locale] ?? message.locale}</dd>
</dl>

{#if message.emailError}
	<p class="notice">
		Die Benachrichtigung per E-Mail ist fehlgeschlagen. Die Nachricht ist nur hier gespeichert.
	</p>
{/if}

<!-- Plain text only: visitor input is never rendered as HTML. -->
<div class="body">{message.message}</div>

<form method="POST" class="actions">
	<a class="btn" href={replyHref}>Antworten</a>
	{#if message.status === 'archived'}
		<button class="btn secondary" formaction="?/unarchive">Zurück in den Posteingang</button>
	{:else}
		<button class="btn secondary" formaction="?/archive">Archivieren</button>
	{/if}
	<button class="btn secondary" formaction="?/unread">Als ungelesen markieren</button>
	<button class="btn danger" formaction="?/delete">Löschen</button>
</form>

<style>
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: var(--space-2) var(--space-6);
		margin: 0 0 var(--space-6);
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
	}

	.body {
		max-width: var(--prose-max);
		padding: var(--space-6);
		background: var(--surface);
		border-radius: var(--radius);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-6);
	}
</style>
