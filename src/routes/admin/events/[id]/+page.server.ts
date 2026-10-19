import { error, fail, redirect } from '@sveltejs/kit';
import { parseEventForm } from '$lib/events/form';
import { assertAdmin } from '$lib/server/auth';
import { getEvent, toFormValues, updateEvent } from '$lib/server/events';
import type { Actions, PageServerLoad } from './$types';

async function load_(id: string) {
	const row = Number.isInteger(Number(id)) ? await getEvent(Number(id)) : undefined;
	if (!row || row.deletedAt) error(404, 'Dieses Konzert gibt es nicht.');
	return row;
}

export const load: PageServerLoad = async ({ params }) => {
	const row = await load_(params.id);
	return { values: toFormValues(row), slug: row.slug, published: row.published };
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		assertAdmin(locals);
		const existing = await load_(params.id);
		const parsed = parseEventForm(await request.formData());
		if (!parsed.ok) return fail(400, { values: parsed.values, errors: parsed.errors });
		await updateEvent(existing, parsed.event);
		redirect(303, `/admin/events?saved=${existing.id}`);
	}
};
