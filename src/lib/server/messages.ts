import { and, desc, eq, lt, ne } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { ContactMessageRow } from './db/schema';

const { contactMessage } = schema;

type NewMessage = Omit<
	ContactMessageRow,
	'id' | 'status' | 'emailSentAt' | 'emailError' | 'createdAt'
>;

export async function storeMessage(message: NewMessage): Promise<ContactMessageRow> {
	const db = await getDb();
	const [row] = await db.insert(contactMessage).values(message).returning();
	return row;
}

export async function recordDelivery(id: number, error: string | null): Promise<void> {
	const db = await getDb();
	await db
		.update(contactMessage)
		.set(error ? { emailError: error } : { emailSentAt: new Date(), emailError: null })
		.where(eq(contactMessage.id, id));
}

export async function listMessages(archived: boolean): Promise<ContactMessageRow[]> {
	const db = await getDb();
	return db
		.select()
		.from(contactMessage)
		.where(archived ? eq(contactMessage.status, 'archived') : ne(contactMessage.status, 'archived'))
		.orderBy(desc(contactMessage.createdAt));
}

export async function getMessage(id: number): Promise<ContactMessageRow | undefined> {
	const db = await getDb();
	const [row] = await db.select().from(contactMessage).where(eq(contactMessage.id, id));
	return row;
}

export async function setMessageStatus(
	id: number,
	status: ContactMessageRow['status']
): Promise<void> {
	const db = await getDb();
	await db.update(contactMessage).set({ status }).where(eq(contactMessage.id, id));
}

export async function deleteMessage(id: number): Promise<void> {
	const db = await getDb();
	await db.delete(contactMessage).where(eq(contactMessage.id, id));
}

export async function countUnread(): Promise<number> {
	const db = await getDb();
	return db.$count(contactMessage, eq(contactMessage.status, 'new'));
}

/** The privacy policy promises at most twelve months of storage. */
export async function purgeOldMessages(now = new Date()): Promise<void> {
	const db = await getDb();
	const cutoff = new Date(now);
	cutoff.setFullYear(cutoff.getFullYear() - 1);
	await db.delete(contactMessage).where(and(lt(contactMessage.createdAt, cutoff)));
}
