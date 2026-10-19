import { error, fail, redirect } from '@sveltejs/kit';
import { parseReleaseForm, type ReleaseFormValues } from '$lib/music/release-form';
import { assertAdmin } from '$lib/server/auth';
import { deleteRelease, getRelease, updateRelease } from '$lib/server/music';
import { getMedia } from '$lib/server/media';
import { photoOptions } from '$lib/server/photo-options';
import type { Actions, PageServerLoad } from './$types';

async function find(id: string) {
	const release = Number.isInteger(Number(id)) ? await getRelease(Number(id)) : undefined;
	if (!release) error(404, 'Diese Aufnahme gibt es nicht.');
	return release;
}

export const load: PageServerLoad = async ({ params }) => {
	const release = await find(params.id);
	const values: ReleaseFormValues = {
		title: release.title,
		artist: release.artist,
		year: release.year ? String(release.year) : '',
		label: release.label ?? '',
		role: release.role ?? '',
		coverMediaId: release.coverMediaId ? String(release.coverMediaId) : '',
		links: release.links.map((link) => `${link.label} | ${link.url}`).join('\n'),
		embed: release.embedUrl ?? '',
		published: release.published ? 'on' : ''
	};
	return { values, photos: await photoOptions() };
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		assertAdmin(locals);
		const release = await find(params.id);
		const parsed = parseReleaseForm(await request.formData());
		if (!parsed.ok) return fail(400, { values: parsed.values, errors: parsed.errors });
		// The photo may have been deleted in another tab since the form was opened.
		if (parsed.release.coverMediaId && !(await getMedia(parsed.release.coverMediaId))) {
			return fail(400, {
				values: { ...parsed.values, coverMediaId: '' },
				errors: { coverMediaId: 'Dieses Foto gibt es nicht mehr. Bitte ein anderes wählen.' }
			});
		}
		await updateRelease(release.id, parsed.release);
		redirect(303, '/admin/music');
	},
	delete: async ({ params, locals }) => {
		assertAdmin(locals);
		await deleteRelease((await find(params.id)).id);
		redirect(303, '/admin/music');
	}
};
