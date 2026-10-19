import { fail, redirect } from '@sveltejs/kit';
import { EMPTY_RELEASE_FORM, parseReleaseForm } from '$lib/music/release-form';
import { assertAdmin } from '$lib/server/auth';
import { createRelease } from '$lib/server/music';
import { getMedia } from '$lib/server/media';
import { photoOptions } from '$lib/server/photo-options';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	values: EMPTY_RELEASE_FORM,
	photos: await photoOptions()
});

export const actions: Actions = {
	save: async ({ request, locals }) => {
		assertAdmin(locals);
		const parsed = parseReleaseForm(await request.formData());
		if (!parsed.ok) return fail(400, { values: parsed.values, errors: parsed.errors });
		// The photo may have been deleted in another tab since the form was opened.
		if (parsed.release.coverMediaId && !(await getMedia(parsed.release.coverMediaId))) {
			return fail(400, {
				values: { ...parsed.values, coverMediaId: '' },
				errors: { coverMediaId: 'Dieses Foto gibt es nicht mehr. Bitte ein anderes wählen.' }
			});
		}
		await createRelease(parsed.release);
		redirect(303, '/admin/music');
	}
};
