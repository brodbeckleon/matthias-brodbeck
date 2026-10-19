import { createHash, randomBytes } from 'node:crypto';
import { error, type Cookies } from '@sveltejs/kit';
import { eq, lt } from 'drizzle-orm';
import { getDb, schema } from './db';

export const SESSION_COOKIE = 'admin_session';
const SESSION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type AdminSession = { id: string; expiresAt: Date };

function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

function setCookie(cookies: Cookies, token: string, expiresAt: Date) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/admin',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export async function createSession(cookies: Cookies): Promise<void> {
	const db = await getDb();
	const token = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
	await db.insert(schema.session).values({ id: hashToken(token), expiresAt });
	// Opportunistic cleanup; there is only ever a handful of sessions.
	await db.delete(schema.session).where(lt(schema.session.expiresAt, new Date()));
	setCookie(cookies, token, expiresAt);
}

/** Returns the session for a valid cookie and slides its expiry forward when it is half used up. */
export async function validateSession(cookies: Cookies): Promise<AdminSession | null> {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return null;

	const db = await getDb();
	const id = hashToken(token);
	const [row] = await db.select().from(schema.session).where(eq(schema.session.id, id));

	if (!row || row.expiresAt.getTime() <= Date.now()) {
		if (row) await db.delete(schema.session).where(eq(schema.session.id, id));
		cookies.delete(SESSION_COOKIE, { path: '/admin' });
		return null;
	}

	if (row.expiresAt.getTime() - Date.now() < (SESSION_DAYS / 2) * DAY_MS) {
		const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
		await db.update(schema.session).set({ expiresAt }).where(eq(schema.session.id, id));
		setCookie(cookies, token, expiresAt);
		return { id, expiresAt };
	}

	return row;
}

export async function invalidateSession(cookies: Cookies, sessionId: string): Promise<void> {
	const db = await getDb();
	await db.delete(schema.session).where(eq(schema.session.id, sessionId));
	cookies.delete(SESSION_COOKIE, { path: '/admin' });
}

export async function invalidateAllSessions(): Promise<void> {
	const db = await getDb();
	await db.delete(schema.session);
}

/** Every admin action and endpoint calls this; the guard in hooks only covers page navigation. */
export function assertAdmin(locals: App.Locals): AdminSession {
	if (!locals.admin) error(401, 'Nicht angemeldet');
	return locals.admin;
}
