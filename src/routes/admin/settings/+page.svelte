<svelte:head>
	<title>Einstellungen – Website verwalten</title>
</svelte:head>

<h1>Einstellungen</h1>

<section>
	<h2>Sicherung</h2>
	<p>
		Lädt alle Konzerte, Fotobeschreibungen, Videos, Aufnahmen und Nachrichten als Datei herunter.
		Die Fotos selbst sind darin nicht enthalten.
	</p>
	<a class="btn secondary" href="/admin/settings/export.json" download>Daten herunterladen</a>
</section>

<section>
	<h2>Überall abmelden</h2>
	<p>
		Beendet die Anmeldung auf allen Geräten, zum Beispiel wenn ein Telefon verloren ging. Danach
		müssen Sie sich neu anmelden.
	</p>
	<form method="POST" action="?/logoutEverywhere">
		<button class="btn danger" type="submit">Überall abmelden</button>
	</form>
</section>

<section>
	<h2>Passwort ändern</h2>
	<p>
		Das Passwort wird bei der Einrichtung der Website festgelegt. Für ein neues Passwort wenden Sie
		sich an Léon; danach hier «Überall abmelden» wählen.
	</p>
</section>

<style>
	section {
		display: grid;
		gap: var(--space-3);
		justify-items: start;
		max-width: var(--prose-max);
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-8);
		border-bottom: 1px solid var(--line);
	}

	h2 {
		font-size: var(--text-lg);
		font-stretch: var(--stretch-body);
	}
</style>
