import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: { PGLITE_DIR: 'memory://', IP_HASH_SALT: 'test' } }));

const { hit, resetLimit } = await import('./rate-limit');

describe('hit', () => {
	beforeAll(async () => {
		// Warm up the in-memory database so the parallel test measures the limit, not migrations.
		await hit('warmup', 1, 1000);
	});

	it('lets exactly `limit` attempts through, even when they arrive at once', async () => {
		const results = await Promise.all(Array.from({ length: 20 }, () => hit('burst', 5, 60_000)));
		expect(results.filter(Boolean)).toHaveLength(5);
	});

	it('starts counting again after resetLimit', async () => {
		for (let i = 0; i < 5; i++) await hit('reset', 5, 60_000);
		expect(await hit('reset', 5, 60_000)).toBe(false);
		await resetLimit('reset');
		expect(await hit('reset', 5, 60_000)).toBe(true);
	});

	it('opens a fresh window once the old one has expired', async () => {
		expect(await hit('window', 1, 1)).toBe(true);
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(await hit('window', 1, 60_000)).toBe(true);
	});
});
