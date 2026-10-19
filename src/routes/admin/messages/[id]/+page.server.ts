import { error, redirect } from '@sveltejs/kit';
import { assertAdmin } from '$lib/server/auth';
import { deleteMessage, getMessage, setMessageStatus } from '$lib/server/messages';
import type { Actions, PageServerLoad } from './$types';

async function find(id: string) {
	const message = Number.isInteger(Number(id)) ? await getMessage(Number(id)) : undefined;
	if (!message) error(404, 'Diese Nachricht gibt es nicht.');
	return message;
}

export const load: PageServerLoad = async ({ params }) => {
	const message = await find(params.id);
	if (message.status === 'new') {
		await setMessageStatus(message.id, 'read');
		message.status = 'read';
	}
	return { message };
};

export const actions: Actions = {
	archive: async ({ params, locals }) => {
		assertAdmin(locals);
		await setMessageStatus((await find(params.id)).id, 'archived');
		redirect(303, '/admin/messages');
	},
	unarchive: async ({ params, locals }) => {
		assertAdmin(locals);
		await setMessageStatus((await find(params.id)).id, 'read');
	},
	unread: async ({ params, locals }) => {
		assertAdmin(locals);
		await setMessageStatus((await find(params.id)).id, 'new');
		redirect(303, '/admin/messages');
	},
	delete: async ({ params, locals }) => {
		assertAdmin(locals);
		await deleteMessage((await find(params.id)).id);
		redirect(303, '/admin/messages');
	}
};
