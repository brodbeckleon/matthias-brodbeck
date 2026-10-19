import { createHash } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getDb, schema } from './db';

/** IPs are stored only as salted hashes. */
export function hashIp(ip: string): string {
	return createHash('sha256')
		.update(`${env.IP_HASH_SALT ?? ''}:${ip}`)
		.digest('hex')
		.slice(0, 32);
}

/**
 * Counts one attempt for `key` in a fixed window and reports whether it is still within `limit`.
 * The counter lives in the database because serverless instances share no memory.
 */
export async function hit(key: string, limit: number, windowMs: number): Promise<boolean> {
	const db = await getDb();
	const resetAt = new Date(Date.now() + windowMs);
	const { rateLimit } = schema;
	const [row] = await db
		.insert(rateLimit)
		.values({ key, count: 1, resetAt })
		.onConflictDoUpdate({
			target: rateLimit.key,
			set: {
				count: sql`case when ${rateLimit.resetAt} < now() then 1 else ${rateLimit.count} + 1 end`,
				resetAt: sql`case when ${rateLimit.resetAt} < now() then ${resetAt.toISOString()}::timestamptz else ${rateLimit.resetAt} end`
			}
		})
		.returning({ count: rateLimit.count });
	return row.count <= limit;
}
