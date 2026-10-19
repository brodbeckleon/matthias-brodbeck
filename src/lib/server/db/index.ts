import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

export type Db = ReturnType<typeof drizzleNeon<typeof schema>>;

const cache = globalThis as typeof globalThis & { __db?: Promise<Db> };

/**
 * Production talks to Neon over HTTP (DATABASE_URL). Without it, local development and tests use
 * PGlite, an embedded Postgres stored in PGLITE_DIR (default .data/pglite), migrated on first use.
 */
export function getDb(): Promise<Db> {
	cache.__db ??= connect();
	return cache.__db;
}

async function connect(): Promise<Db> {
	if (env.DATABASE_URL) return drizzleNeon(neon(env.DATABASE_URL), { schema });

	const { PGlite } = await import('@electric-sql/pglite');
	const { drizzle } = await import('drizzle-orm/pglite');
	const { migrate } = await import('drizzle-orm/pglite/migrator');
	const dir = env.PGLITE_DIR || '.data/pglite';
	// PGlite only creates the last path segment itself. "memory://" keeps tests off the disk.
	if (!dir.startsWith('memory://')) mkdirSync(dirname(dir), { recursive: true });
	const client = new PGlite(dir);
	const db = drizzle(client, { schema });
	await migrate(db, { migrationsFolder: 'drizzle' });
	// Both drivers expose the same query builder; only the transport differs.
	return db as unknown as Db;
}

export { schema };
