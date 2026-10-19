import { json } from '@sveltejs/kit';
import { assertAdmin } from '$lib/server/auth';
import { getDb, schema } from '$lib/server/db';
import { purgeOldMessages } from '$lib/server/messages';
import type { RequestHandler } from './$types';

/** A full content backup. Sessions and rate-limit counters are left out on purpose. */
export const GET: RequestHandler = async ({ locals }) => {
	assertAdmin(locals);
	await purgeOldMessages();
	const db = await getDb();
	const [events, media, videos, releases, messages] = await Promise.all([
		db.select().from(schema.event),
		db.select().from(schema.media),
		db.select().from(schema.video),
		db.select().from(schema.release),
		db.select().from(schema.contactMessage)
	]);
	const date = new Date().toISOString().slice(0, 10);
	return json(
		{ exportedAt: new Date().toISOString(), events, media, videos, releases, messages },
		{ headers: { 'content-disposition': `attachment; filename="website-${date}.json"` } }
	);
};
