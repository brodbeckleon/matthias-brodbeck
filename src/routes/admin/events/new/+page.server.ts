import { fail, redirect } from '@sveltejs/kit';
import { EMPTY_EVENT_FORM, parseEventForm } from '$lib/events/form';
import { assertAdmin } from '$lib/server/auth';
import { createEvent } from '$lib/server/events';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ values: EMPTY_EVENT_FORM });

export const actions: Actions = {
	save: async ({ request, locals }) => {
		assertAdmin(locals);
		const parsed = parseEventForm(await request.formData());
		if (!parsed.ok) return fail(400, { values: parsed.values, errors: parsed.errors });
		const created = await createEvent(parsed.event);
		redirect(303, `/admin/events?saved=${created.id}`);
	}
};
