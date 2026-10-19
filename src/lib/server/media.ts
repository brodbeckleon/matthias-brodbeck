import { and, asc, eq, gt, lt, desc, max } from 'drizzle-orm';
import type { LocalizedText } from '$lib/i18n/localized';
import { getDb, schema } from './db';
import type { MediaRow } from './db/schema';

const { media } = schema;

export async function listMedia(): Promise<MediaRow[]> {
	const db = await getDb();
	return db.select().from(media).orderBy(asc(media.sortOrder), asc(media.id));
}

export async function listGallery(): Promise<MediaRow[]> {
	const db = await getDb();
	return db
		.select()
		.from(media)
		.where(eq(media.published, true))
		.orderBy(asc(media.sortOrder), asc(media.id));
}

export async function getPortrait(): Promise<MediaRow | undefined> {
	const db = await getDb();
	const [row] = await db
		.select()
		.from(media)
		.where(and(eq(media.portrait, true), eq(media.published, true)));
	return row;
}

export async function getMedia(id: number): Promise<MediaRow | undefined> {
	const db = await getDb();
	const [row] = await db.select().from(media).where(eq(media.id, id));
	return row;
}

export async function insertMedia(
	values: Pick<MediaRow, 'url' | 'storageKey' | 'width' | 'height'>
): Promise<MediaRow> {
	const db = await getDb();
	const [{ last }] = await db.select({ last: max(media.sortOrder) }).from(media);
	const [row] = await db
		.insert(media)
		.values({ ...values, sortOrder: (last ?? 0) + 1 })
		.returning();
	return row;
}

export async function updateMedia(
	id: number,
	values: { alt: LocalizedText; credit: string | null; published: boolean }
): Promise<void> {
	const db = await getDb();
	await db.update(media).set(values).where(eq(media.id, id));
}

export async function setPortrait(id: number | null): Promise<void> {
	const db = await getDb();
	await db.update(media).set({ portrait: false }).where(eq(media.portrait, true));
	if (id !== null) await db.update(media).set({ portrait: true }).where(eq(media.id, id));
}

/** Swaps the photo with its neighbour in the gallery order. */
export async function moveMedia(id: number, direction: 'up' | 'down'): Promise<void> {
	const db = await getDb();
	const current = await getMedia(id);
	if (!current) return;
	const [neighbour] = await db
		.select()
		.from(media)
		.where(
			direction === 'up'
				? lt(media.sortOrder, current.sortOrder)
				: gt(media.sortOrder, current.sortOrder)
		)
		.orderBy(direction === 'up' ? desc(media.sortOrder) : asc(media.sortOrder))
		.limit(1);
	if (!neighbour) return;
	await db.update(media).set({ sortOrder: neighbour.sortOrder }).where(eq(media.id, current.id));
	await db.update(media).set({ sortOrder: current.sortOrder }).where(eq(media.id, neighbour.id));
}

/** Removes the row and returns the storage key, so the caller can delete the file. */
export async function deleteMedia(id: number): Promise<string | undefined> {
	const db = await getDb();
	const [row] = await db.delete(media).where(eq(media.id, id)).returning();
	return row?.storageKey;
}
