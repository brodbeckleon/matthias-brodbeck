import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import settings from '../../../project.inlang/settings.json';

// Paraglide silently falls back to the base locale for missing keys, so parity is checked here.
function load(locale: string): Record<string, string> {
	const { $schema: _schema, ...messages } = JSON.parse(
		readFileSync(new URL(`../../../messages/${locale}.json`, import.meta.url), 'utf8')
	);
	return messages;
}

const base = load(settings.baseLocale);

describe.each(settings.locales)('messages/%s.json', (locale) => {
	const messages = load(locale);

	it('has exactly the base locale keys', () => {
		expect(Object.keys(messages).sort()).toEqual(Object.keys(base).sort());
	});

	it('has no empty messages', () => {
		const empty = Object.entries(messages).filter(([, value]) => !value.trim());
		expect(empty).toEqual([]);
	});

	it('uses the same placeholders as the base locale', () => {
		const vars = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
		for (const [key, value] of Object.entries(messages)) {
			expect(vars(value), key).toEqual(vars(base[key]));
		}
	});
});

it('Swiss German uses "ss", never "ß"', () => {
	const withEszett = Object.entries(load('de-ch')).filter(([, value]) => value.includes('ß'));
	expect(withEszett).toEqual([]);
});
