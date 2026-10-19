type IcsEvent = {
	slug: string;
	title: string;
	startsAt: Date;
	endsAt: Date | null;
	status: 'scheduled' | 'cancelled' | 'postponed';
	venueName: string;
	street: string | null;
	postalCode: string | null;
	city: string;
	updatedAt: Date;
};

const ICS_STATUS = {
	scheduled: 'CONFIRMED',
	postponed: 'TENTATIVE',
	cancelled: 'CANCELLED'
} as const;

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

function stamp(date: Date): string {
	return date
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/, '');
}

// RFC 5545 text escaping.
function escape(text: string): string {
	return text
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r?\n/g, '\\n');
}

/** A single-event iCalendar file. Times are UTC, so every calendar app shows them correctly. */
export function eventToIcs(event: IcsEvent, url: string, host: string): string {
	const end = event.endsAt ?? new Date(event.startsAt.getTime() + DEFAULT_DURATION_MS);
	const location = [
		event.venueName,
		event.street,
		[event.postalCode, event.city].filter(Boolean).join(' ')
	]
		.filter(Boolean)
		.join(', ');
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Matthias Brodbeck//Concerts//EN',
		'BEGIN:VEVENT',
		`UID:${event.slug}@${host}`,
		`DTSTAMP:${stamp(event.updatedAt)}`,
		`DTSTART:${stamp(event.startsAt)}`,
		`DTEND:${stamp(end)}`,
		`SUMMARY:${escape(`${event.title} – Matthias Brodbeck`)}`,
		`LOCATION:${escape(location)}`,
		`URL:${url}`,
		`STATUS:${ICS_STATUS[event.status]}`,
		'END:VEVENT',
		'END:VCALENDAR',
		''
	].join('\r\n');
}
