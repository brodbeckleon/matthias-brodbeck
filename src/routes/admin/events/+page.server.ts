import { fail, redirect } from '@sveltejs/kit';
import { assertAdmin } from '$lib/server/auth';
import {
	duplicateEvent,
	listDeleted,
	listForAdmin,
	setPublished,
	setStatus,
	softDelete
} from '$lib/server/events';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const now = Date.now();
	const events = await listForAdmin();
	// Admin view: an event counts as past once its start day is over.
	const isPast = (e: (typeof events)[number]) =>
		(e.endsAt ?? new Date(e.startsAt.getTime() + 6 * 60 * 60 * 1000)).getTime() < now;
	return {
		upcoming: events.filter((e) => e.published && !isPast(e)),
		drafts: events.filter((e) => !e.published),
		past: events.filter((e) => e.published && isPast(e)).reverse(),
		deleted: await listDeleted()
	};
};

async function idFrom(request: Request) {
	const id = Number((await request.formData()).get('id'));
	if (!Number.isInteger(id)) throw fail(400, { error: 'Ungültige Anfrage.' });
	return id;
}

export const actions: Actions = {
	publish: async ({ request, locals }) => {
		assertAdmin(locals);
		await setPublished(await idFrom(request), true);
	},
	unpublish: async ({ request, locals }) => {
		assertAdmin(locals);
		await setPublished(await idFrom(request), false);
	},
	cancel: async ({ request, locals }) => {
		assertAdmin(locals);
		await setStatus(await idFrom(request), 'cancelled');
	},
	reinstate: async ({ request, locals }) => {
		assertAdmin(locals);
		await setStatus(await idFrom(request), 'scheduled');
	},
	duplicate: async ({ request, locals }) => {
		assertAdmin(locals);
		const copy = await duplicateEvent(await idFrom(request));
		if (copy) redirect(303, `/admin/events/${copy.id}`);
	},
	delete: async ({ request, locals }) => {
		assertAdmin(locals);
		const id = await idFrom(request);
		await softDelete(id, true);
		return { deleted: id };
	},
	restore: async ({ request, locals }) => {
		assertAdmin(locals);
		await softDelete(await idFrom(request), false);
	}
};
