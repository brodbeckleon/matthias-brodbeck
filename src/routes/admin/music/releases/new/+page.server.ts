import { fail, redirect } from '@sveltejs/kit';
import { EMPTY_RELEASE_FORM, parseReleaseForm } from '$lib/music/release-form';
import { assertAdmin } from '$lib/server/auth';
import { createRelease } from '$lib/server/music';
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
		await createRelease(parsed.release);
		redirect(303, '/admin/music');
	}
};
