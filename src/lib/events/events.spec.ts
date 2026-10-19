import { describe, expect, it } from 'vitest';
import { eventToIcs } from './ics';
import { parseEventForm } from './form';
import { eventSlug, uniqueSlug } from './slug';
import { utcToZoned, zonedToUtc } from './time';
import { pickLocale } from '../i18n/localized';

describe('zonedToUtc', () => {
	it('converts Zurich winter time (UTC+1)', () => {
		expect(zonedToUtc('2026-01-10', '20:00', 'Europe/Zurich').toISOString()).toBe(
			'2026-01-10T19:00:00.000Z'
		);
	});

	it('converts Zurich summer time (UTC+2)', () => {
		expect(zonedToUtc('2026-07-10', '20:00', 'Europe/Zurich').toISOString()).toBe(
			'2026-07-10T18:00:00.000Z'
		);
	});

	it('handles the day clocks go back', () => {
		expect(zonedToUtc('2026-10-25', '20:00', 'Europe/Zurich').toISOString()).toBe(
			'2026-10-25T19:00:00.000Z'
		);
	});

	it('round-trips through utcToZoned', () => {
		const instant = zonedToUtc('2026-03-29', '19:30', 'Asia/Tokyo');
		expect(utcToZoned(instant, 'Asia/Tokyo')).toEqual({ date: '2026-03-29', time: '19:30' });
	});
});

describe('eventSlug', () => {
	it('transliterates German umlauts', () => {
		expect(eventSlug('2026-11-14', 'Konzert in Zürich – Grössenwahn')).toBe(
			'2026-11-14-konzert-in-zuerich-groessenwahn'
		);
	});

	it('falls back when the title has no Latin letters', () => {
		expect(eventSlug('2026-11-14', 'コンサート')).toBe('2026-11-14-konzert');
	});

	it('adds a suffix until the slug is free', async () => {
		const taken = new Set(['a', 'a-2']);
		expect(await uniqueSlug('a', async (slug) => taken.has(slug))).toBe('a-3');
	});
});

describe('parseEventForm', () => {
	function form(values: Record<string, string>) {
		const data = new FormData();
		const defaults = {
			title: 'Gig',
			date: '2026-11-14',
			startTime: '20:00',
			endTime: '',
			timezone: 'Europe/Zurich',
			venueName: 'Moods',
			city: 'Zürich',
			country: 'ch',
			status: 'scheduled'
		};
		for (const [key, value] of Object.entries({ ...defaults, ...values })) data.set(key, value);
		return data;
	}

	it('moves an end time before the start to the next day', () => {
		const result = parseEventForm(form({ startTime: '21:00', endTime: '01:00' }));
		expect(result.ok && result.event.endsAt?.toISOString()).toBe('2026-11-15T00:00:00.000Z');
	});

	it('normalises the country code and empty optional fields', () => {
		const result = parseEventForm(form({ ticketUrl: '' }));
		expect(result.ok && result.event.country).toBe('CH');
		expect(result.ok && result.event.ticketUrl).toBeNull();
		expect(result.ok && result.event.published).toBe(false);
	});

	it('rejects links without https://', () => {
		const result = parseEventForm(form({ ticketUrl: 'javascript:alert(1)' }));
		expect(result.ok).toBe(false);
		expect(!result.ok && result.errors.ticketUrl).toMatch(/https/);
	});

	it('reports missing required fields in German', () => {
		const result = parseEventForm(form({ title: '', city: '' }));
		expect(!result.ok && result.errors).toMatchObject({
			title: 'Bitte einen Titel eingeben.',
			city: 'Bitte die Stadt eingeben.'
		});
	});
});

describe('pickLocale', () => {
	it('prefers the requested language', () => {
		expect(pickLocale({ 'de-ch': 'Hallo', en: 'Hello' }, 'en')).toEqual({
			value: 'Hello',
			lang: 'en'
		});
	});

	it('falls back from Japanese to English before German', () => {
		expect(pickLocale({ 'de-ch': 'Hallo', en: 'Hello' }, 'ja')).toEqual({
			value: 'Hello',
			lang: 'en'
		});
	});

	it('returns null when nothing is filled in', () => {
		expect(pickLocale({ en: '  ' }, 'en')).toBeNull();
	});
});

describe('eventToIcs', () => {
	it('escapes text and marks cancelled events', () => {
		const ics = eventToIcs(
			{
				slug: 's',
				title: 'A, B; C',
				startsAt: new Date('2026-11-14T19:00:00Z'),
				endsAt: null,
				status: 'cancelled',
				venueName: 'Moods',
				street: null,
				postalCode: '8005',
				city: 'Zürich',
				updatedAt: new Date('2026-10-01T00:00:00Z')
			},
			'https://example.com/events/s',
			'example.com'
		);
		expect(ics).toContain('SUMMARY:A\\, B\\; C – Matthias Brodbeck');
		expect(ics).toContain('DTEND:20261114T210000Z');
		expect(ics).toContain('STATUS:CANCELLED');
		expect(ics).toContain('\r\n');
	});
});
