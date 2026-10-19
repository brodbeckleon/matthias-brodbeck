import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
	it('verifies the right password and rejects others', async () => {
		const hash = await hashPassword('correct horse battery');
		expect(hash).toMatch(/^scrypt:32768:8:1:/);
		expect(hash).not.toContain('$');
		expect(await verifyPassword('correct horse battery', hash)).toBe(true);
		expect(await verifyPassword('wrong', hash)).toBe(false);
	});

	it('rejects malformed hashes', async () => {
		expect(await verifyPassword('x', 'bcrypt:whatever')).toBe(false);
	});
});
