<svelte:head>
	<title>Übersicht – Website verwalten</title>
</svelte:head>

<h1>Übersicht</h1>

<div class="tiles">
	<a class="tile" href="/admin/events/new">
		<strong>Neues Konzert</strong>
		<span>Datum, Ort und Besetzung eintragen</span>
	</a>
	<a class="tile" href="/admin/events">
		<strong>Konzerte verwalten</strong>
		<span>Bearbeiten, veröffentlichen, absagen</span>
	</a>
	<div class="tile pending">
		<strong>Fotos</strong>
		<span>Folgt bald</span>
	</div>
	<div class="tile pending">
		<strong>Videos und Aufnahmen</strong>
		<span>Folgt bald</span>
	</div>
</div>

<style>
	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: var(--space-4);
	}

	.tile {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-6);
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--text);
		text-decoration: none;
	}

	a.tile:hover {
		border-color: var(--accent);
	}

	.tile strong {
		font-size: var(--text-lg);
	}

	.tile span {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.pending {
		opacity: 0.7;
	}
</style>
