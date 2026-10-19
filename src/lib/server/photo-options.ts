import { listMedia } from './media';

/** Photos as <select> options for admin forms, labelled by their description. */
export async function photoOptions() {
	return (await listMedia()).map((photo) => ({
		id: photo.id,
		label: photo.alt['de-ch'] || `Foto ${photo.id} (ohne Beschreibung)`
	}));
}
