import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	// The admin tests share one database, so run serially.
	workers: 1,
	webServer: {
		command: 'rm -rf .data/e2e && npm run build && npm run preview -- --port 4173 --strictPort',
		port: 4173,
		reuseExistingServer: false,
		env: {
			DATABASE_URL: '',
			PGLITE_DIR: '.data/e2e',
			IP_HASH_SALT: 'e2e',
			// Hash of the test-only password "e2e-test-password".
			ADMIN_PASSWORD_HASH:
				'scrypt:32768:8:1:SNod17LzcPG/7twbtQp6Rw==:KhkQSZmhGoQOHkc9vzA7FBw+IPDyt8BQcPcjY/GoB8H1ElQnYHYeFbuWyCEIH9S7OhhBfOj8ZSEBr+edUb0z5g=='
		}
	},
	use: { baseURL: 'http://localhost:4173' }
});
