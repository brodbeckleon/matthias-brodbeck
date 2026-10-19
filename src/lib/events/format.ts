import type { Locale } from '$lib/paraglide/runtime';
import { toBcp47 } from '$lib/i18n/format';

/** Dates are always shown in the event's own time zone, not the visitor's. */
export function formatEventDate(instant: Date, locale: Locale, timeZone: string): string {
	return new Intl.DateTimeFormat(toBcp47(locale), {
		weekday: 'short',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone
	}).format(instant);
}

export function formatEventTime(instant: Date, locale: Locale, timeZone: string): string {
	return new Intl.DateTimeFormat(toBcp47(locale), {
		// "8:30 PM" in English; 24-hour "00:30" elsewhere.
		hour: locale === 'en' ? 'numeric' : '2-digit',
		minute: '2-digit',
		timeZone
	}).format(instant);
}

/** Parts for the large date block on event cards. */
export function eventDateParts(instant: Date, locale: Locale, timeZone: string) {
	const part = (options: Intl.DateTimeFormatOptions) =>
		new Intl.DateTimeFormat(toBcp47(locale), { ...options, timeZone }).format(instant);
	return {
		day: part({ day: 'numeric' }),
		month: part({ month: 'short' }),
		weekday: part({ weekday: 'short' }),
		year: part({ year: 'numeric' })
	};
}
