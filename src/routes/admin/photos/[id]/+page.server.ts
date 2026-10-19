import { error, fail, redirect } from '@sveltejs/kit';
import { assertAdmin } from '$lib/server/auth';
import { deleteMedia, getMedia, setPortrait, updateMedia } from '$lib/server/media';
import { deleteFile } from '$lib/server/storage';
import type { Actions, PageServerLoad } from './$types';

async function find(id: string) {
	const photo = Number.isInteger(Number(id)) ? await getMedia(Number(id)) : undefined;
	if (!photo) error(404, 'Dieses Foto gibt es nicht.');
	return photo;
}

const text = (value: FormDataEntryValue | null, max: number) =>
	String(value ?? '')
		.trim()
		.slice(0, max);

export const load: PageServerLoad = async ({ params }) => ({ photo: await find(params.id) });

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		assertAdmin(locals);
		const photo = await find(params.id);
		const data = await request.formData();
		const alt = {
			'de-ch': text(data.get('altDe'), 300),
			en: text(data.get('altEn'), 300),
			ja: text(data.get('altJa'), 300)
		};
		const published = data.get('published') === 'on';
		// Screen-reader users need a description; it is required before a photo goes public.
		if (published && !alt['de-ch']) {
			return fail(400, { error: 'Bitte zuerst eine deutsche Bildbeschreibung eingeben.' });
		}
		await updateMedia(photo.id, {
			alt: Object.fromEntries(Object.entries(alt).filter(([, value]) => value)),
			credit: text(data.get('credit'), 200) || null,
			published
		});
		if (!published && photo.portrait) await setPortrait(null);
		redirect(303, '/admin/photos');
	},
	portrait: async ({ params, locals }) => {
		assertAdmin(locals);
		const photo = await find(params.id);
		if (!photo.published) {
			return fail(400, { error: 'Nur veröffentlichte Fotos können als Porträt dienen.' });
		}
		await setPortrait(photo.portrait ? null : photo.id);
	},
	delete: async ({ params, locals }) => {
		assertAdmin(locals);
		const key = await deleteMedia((await find(params.id)).id);
		if (key) await deleteFile(key);
		redirect(303, '/admin/photos');
	}
};
