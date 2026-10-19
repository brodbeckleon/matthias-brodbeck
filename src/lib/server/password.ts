import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

// Format: scrypt:N:r:p:saltBase64:hashBase64 ("$" is avoided because dotenv expands it).
const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

function derive(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
	return new Promise((resolve, reject) =>
		scrypt(
			password,
			salt,
			KEY_LENGTH,
			{ ...options, maxmem: 128 * options.N! * options.r! * 2 },
			(err, key) => (err ? reject(err) : resolve(key))
		)
	);
}

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);
	const key = await derive(password, salt, { N, r: R, p: P });
	return ['scrypt', N, R, P, salt.toString('base64'), key.toString('base64')].join(':');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [algorithm, n, r, p, salt, hash] = stored.split(':');
	if (algorithm !== 'scrypt' || !salt || !hash) return false;
	const expected = Buffer.from(hash, 'base64');
	const actual = await derive(password, Buffer.from(salt, 'base64'), {
		N: Number(n),
		r: Number(r),
		p: Number(p)
	});
	return actual.length === expected.length && timingSafeEqual(actual, expected);
}
