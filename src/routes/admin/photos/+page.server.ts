import { assertAdmin } from '$lib/server/auth';
import { listMedia, moveMedia } from '$lib/server/media';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ photos: await listMedia() });

export const actions: Actions = {
	move: async ({ request, locals }) => {
		assertAdmin(locals);
		const data = await request.formData();
		const direction = data.get('direction') === 'up' ? 'up' : 'down';
		await moveMedia(Number(data.get('id')), direction);
	}
};
