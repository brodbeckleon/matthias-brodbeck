import { fail } from '@sveltejs/kit';
import { parseYouTubeId } from '$lib/music/embeds';
import { assertAdmin } from '$lib/server/auth';
import {
	addVideo,
	deleteVideo,
	listReleases,
	listVideos,
	moveVideo,
	setVideoPublished
} from '$lib/server/music';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	videos: await listVideos(false),
	releases: await listReleases(false)
});

const idOf = (data: FormData) => Number(data.get('id'));

export const actions: Actions = {
	addVideo: async ({ request, locals }) => {
		assertAdmin(locals);
		const data = await request.formData();
		const url = String(data.get('url') ?? '');
		const title =
			String(data.get('title') ?? '')
				.trim()
				.slice(0, 200) || null;
		const id = parseYouTubeId(url);
		if (!id) {
			return fail(400, { url, title, error: 'Das ist keine YouTube-Adresse.' });
		}
		const result = await addVideo(id, title);
		if (!result.ok) return fail(400, { url, title, error: result.error });
		return { added: true };
	},
	publish: async ({ request, locals }) => {
		assertAdmin(locals);
		await setVideoPublished(idOf(await request.formData()), true);
	},
	hide: async ({ request, locals }) => {
		assertAdmin(locals);
		await setVideoPublished(idOf(await request.formData()), false);
	},
	move: async ({ request, locals }) => {
		assertAdmin(locals);
		const data = await request.formData();
		await moveVideo(idOf(data), data.get('direction') === 'up' ? 'up' : 'down');
	},
	deleteVideo: async ({ request, locals }) => {
		assertAdmin(locals);
		await deleteVideo(idOf(await request.formData()));
	}
};
