// Usage: npm run admin:hash -- 'the new password'
// Prints the value for ADMIN_PASSWORD_HASH.
import { hashPassword } from '../src/lib/server/password.ts';

const password = process.argv[2];
if (!password || password.length < 12) {
	console.error('Pass a password of at least 12 characters.');
	process.exit(1);
}
console.log(await hashPassword(password));
