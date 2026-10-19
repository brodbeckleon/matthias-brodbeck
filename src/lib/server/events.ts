import { and, asc, desc, eq, gt, isNotNull, isNull, lte, ne, sql } from 'drizzle-orm';
import { eventSlug, uniqueSlug } from '$lib/events/slug';
import { utcToZoned } from '$lib/events/time';
import type { EventFormValues } from '$lib/events/form';
import { getDb, schema } from './db';
import type { EventRow, NewEventRow } from './db/schema';

const { event } = schema;

/**
 * When an event stops being "upcoming": its end time, or else the end of its start day in its own
 * time zone, so tonight's concert stays listed all evening.
 */
const endOfEvent = sql`coalesce(${event.endsAt}, (date_trunc('day', ${event.startsAt} at time zone ${event.timezone}) + interval '1 day') at time zone ${event.timezone})`;

const isPublic = and(eq(event.published, true), isNull(event.deletedAt));

export async function listUpcoming(now: Date, limit?: number): Promise<EventRow[]> {
	const db = await getDb();
	const query = db
		.select()
		.from(event)
		.where(and(isPublic, gt(endOfEvent, now)))
		.orderBy(asc(event.startsAt));
	return limit ? query.limit(limit) : query;
}

export async function listPast(now: Date): Promise<EventRow[]> {
	const db = await getDb();
	return db
		.select()
		.from(event)
		.where(and(isPublic, lte(endOfEvent, now)))
		.orderBy(desc(event.startsAt));
}

export async function getPublicEvent(slug: string): Promise<EventRow | undefined> {
	const db = await getDb();
	const [row] = await db
		.select()
		.from(event)
		.where(and(isPublic, eq(event.slug, slug)));
	return row;
}

// Admin

export async function listForAdmin(): Promise<EventRow[]> {
	const db = await getDb();
	return db.select().from(event).where(isNull(event.deletedAt)).orderBy(asc(event.startsAt));
}

export async function listDeleted(): Promise<EventRow[]> {
	const db = await getDb();
	return db
		.select()
		.from(event)
		.where(isNotNull(event.deletedAt))
		.orderBy(desc(event.deletedAt))
		.limit(10);
}

export async function getEvent(id: number): Promise<EventRow | undefined> {
	const db = await getDb();
	const [row] = await db.select().from(event).where(eq(event.id, id));
	return row;
}

async function freeSlug(base: string, exceptId?: number): Promise<string> {
	const db = await getDb();
	return uniqueSlug(base, async (slug) => {
		const [row] = await db
			.select({ id: event.id })
			.from(event)
			.where(exceptId ? and(eq(event.slug, slug), ne(event.id, exceptId)) : eq(event.slug, slug));
		return Boolean(row);
	});
}

type EventInput = Omit<NewEventRow, 'id' | 'slug'>;

function zonedDate(input: EventInput) {
	return utcToZoned(input.startsAt, input.timezone ?? 'Europe/Zurich').date;
}

export async function createEvent(input: EventInput): Promise<EventRow> {
	const db = await getDb();
	const slug = await freeSlug(eventSlug(zonedDate(input), input.title));
	const [row] = await db
		.insert(event)
		.values({ ...input, slug, publishedAt: input.published ? new Date() : null })
		.returning();
	return row;
}

export async function updateEvent(existing: EventRow, input: EventInput): Promise<EventRow> {
	const db = await getDb();
	// Links to a published event must keep working, so its slug is frozen from then on.
	const slug = existing.publishedAt
		? existing.slug
		: await freeSlug(eventSlug(zonedDate(input), input.title), existing.id);
	const publishedAt = existing.publishedAt ?? (input.published ? new Date() : null);
	const [row] = await db
		.update(event)
		.set({ ...input, slug, publishedAt })
		.where(eq(event.id, existing.id))
		.returning();
	return row;
}

export async function setPublished(id: number, published: boolean): Promise<void> {
	const db = await getDb();
	const existing = await getEvent(id);
	if (!existing) return;
	await db
		.update(event)
		.set({ published, publishedAt: existing.publishedAt ?? (published ? new Date() : null) })
		.where(eq(event.id, id));
}

export async function setStatus(id: number, status: EventRow['status']): Promise<void> {
	const db = await getDb();
	await db.update(event).set({ status }).where(eq(event.id, id));
}

export async function softDelete(id: number, deleted: boolean): Promise<void> {
	const db = await getDb();
	await db
		.update(event)
		.set({ deletedAt: deleted ? new Date() : null })
		.where(eq(event.id, id));
}

/** A copy as an unpublished draft, for recurring gigs. */
export async function duplicateEvent(id: number): Promise<EventRow | undefined> {
	const existing = await getEvent(id);
	if (!existing) return;
	const { id: _id, slug: _slug, createdAt: _c, updatedAt: _u, publishedAt: _p, ...copy } = existing;
	return createEvent({ ...copy, published: false, deletedAt: null, status: 'scheduled' });
}

/** Database row → strings for the edit form. */
export function toFormValues(row: EventRow): EventFormValues {
	const start = utcToZoned(row.startsAt, row.timezone);
	return {
		title: row.title,
		date: start.date,
		startTime: start.time,
		endTime: row.endsAt ? utcToZoned(row.endsAt, row.timezone).time : '',
		timezone: row.timezone,
		venueName: row.venueName,
		street: row.street ?? '',
		postalCode: row.postalCode ?? '',
		city: row.city,
		country: row.country,
		venueUrl: row.venueUrl ?? '',
		ticketUrl: row.ticketUrl ?? '',
		lineup: row.lineup ?? '',
		descriptionDe: row.description['de-ch'] ?? '',
		descriptionEn: row.description.en ?? '',
		descriptionJa: row.description.ja ?? '',
		status: row.status,
		published: row.published ? 'on' : ''
	};
}
