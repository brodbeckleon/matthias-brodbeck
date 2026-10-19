<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { keepFocus } from '$lib/admin/form-helpers';
	import { resizeImage } from '$lib/client/resize-image';

	let { data } = $props();

	type UploadState = { name: string; status: 'pending' | 'done' | 'error'; message?: string };
	let uploads = $state<UploadState[]>([]);

	async function upload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])];
		input.value = '';
		uploads = files.map((file) => ({ name: file.name, status: 'pending' }));

		for (const [i, file] of files.entries()) {
			try {
				const resized = await resizeImage(file);
				const body = new FormData();
				body.set('file', resized.blob, `upload.${resized.extension}`);
				body.set('width', String(resized.width));
				body.set('height', String(resized.height));
				const response = await fetch('/admin/api/upload', { method: 'POST', body });
				if (response.status === 401) {
					// Stop here and stay on the page: reloading the data would jump to the login form
					// and hide this message.
					const message = 'Nicht mehr angemeldet. Bitte neu anmelden und erneut hochladen.';
					uploads = uploads.map((item, j) =>
						j >= i ? { ...item, status: 'error', message } : item
					);
					return;
				}
				if (!response.ok) {
					const { message } = await response.json().catch(() => ({ message: '' }));
					throw new Error(message || `Fehler ${response.status}`);
				}
				uploads[i].status = 'done';
			} catch (err) {
				uploads[i] = {
					...uploads[i],
					status: 'error',
					message: err instanceof Error ? err.message : String(err)
				};
			}
		}
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Fotos – Website verwalten</title>
</svelte:head>

<h1>Fotos</h1>

<div class="upload">
	<label class="btn" for="files">Fotos hochladen</label>
	<input id="files" type="file" accept="image/*" multiple onchange={upload} />
	<p class="hint">
		Fotos werden vor dem Hochladen verkleinert, Standortdaten werden dabei entfernt. Neue Fotos sind
		zunächst nicht öffentlich: Bildbeschreibung ergänzen und dann veröffentlichen.
	</p>
	{#if uploads.length}
		<ul class="progress" aria-live="polite">
			{#each uploads as item, i (i)}
				<li class={item.status}>
					{item.name}:
					{item.status === 'pending'
						? 'wird hochgeladen …'
						: item.status === 'done'
							? 'fertig'
							: item.message}
				</li>
			{/each}
		</ul>
	{/if}
</div>

{#if data.photos.length === 0}
	<p class="empty">Noch keine Fotos.</p>
{:else}
	<ul class="grid">
		{#each data.photos as photo, i (photo.id)}
			<li>
				<!-- The "Bearbeiten" link below names the action; this one is a mouse shortcut. -->
				<a href="/admin/photos/{photo.id}" tabindex="-1" aria-hidden="true">
					<img
						src={photo.url}
						alt={photo.alt['de-ch'] ?? ''}
						width={photo.width}
						height={photo.height}
						loading="lazy"
					/>
				</a>
				<div class="meta">
					<span>
						{photo.published ? 'Öffentlich' : 'Entwurf'}{photo.portrait ? ', Porträt' : ''}
					</span>
					{#if !photo.alt['de-ch']}<span class="warn">Beschreibung fehlt</span>{/if}
				</div>
				<form method="POST" action="?/move" use:enhance={keepFocus} class="order">
					<input type="hidden" name="id" value={photo.id} />
					<button
						class="btn secondary"
						name="direction"
						value="up"
						disabled={i === 0}
						aria-label="Nach vorne">←</button
					>
					<button
						class="btn secondary"
						name="direction"
						value="down"
						disabled={i === data.photos.length - 1}
						aria-label="Nach hinten">→</button
					>
					<a class="btn secondary" href="/admin/photos/{photo.id}">Bearbeiten</a>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.upload {
		display: grid;
		gap: var(--space-3);
		margin-bottom: var(--space-8);
	}

	.upload label {
		justify-self: start;
	}

	/* The native input stays focusable but invisible; the label is the button. */
	#files {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
	}

	.upload:has(#files:focus-visible) label {
		outline: 2px solid var(--accent-ink);
		outline-offset: 3px;
	}

	.hint,
	.empty {
		color: var(--text-muted);
		font-size: var(--text-sm);
	}

	.progress {
		margin: 0;
		padding-left: var(--space-6);
		font-size: var(--text-sm);
	}

	.progress .error {
		color: var(--danger);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		gap: var(--space-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: var(--radius);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: var(--space-2) 0;
		font-size: var(--text-sm);
	}

	.warn {
		color: var(--danger);
	}

	.order {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
