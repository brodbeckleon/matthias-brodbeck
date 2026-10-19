import { describe, expect, it } from 'vitest';
import { personLd, serializeJsonLd } from './jsonld';

describe('serializeJsonLd', () => {
	it('escapes "<" so the data cannot close its script tag', () => {
		const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
		expect(out).not.toContain('<');
		expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
	});
});

describe('personLd', () => {
	it('links every social profile', () => {
		expect(personLd().sameAs).toHaveLength(3);
	});
});
