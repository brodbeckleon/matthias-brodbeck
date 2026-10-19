import { SITE_URL, SOCIAL_LINKS } from '$lib/site';

export function personLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Matthias Brodbeck',
		url: SITE_URL,
		birthDate: '1971',
		jobTitle: ['Drummer', 'Percussionist', 'Music teacher'],
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Zürich',
			addressCountry: 'CH'
		},
		alumniOf: { '@type': 'CollegeOrUniversity', name: 'Hochschule Luzern' },
		memberOf: [
			{ '@type': 'MusicGroup', name: 'The Stone Alphabet' },
			{ '@type': 'MusicGroup', name: 'Saitenschlag' }
		],
		sameAs: SOCIAL_LINKS.map((link) => link.href)
	};
}

// JSON-LD is embedded in a <script> tag, so "<" must never appear literally.
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

type EventLdInput = {
	title: string;
	startsAt: Date;
	endsAt: Date | null;
	status: 'scheduled' | 'cancelled' | 'postponed';
	venueName: string;
	street: string | null;
	postalCode: string | null;
	city: string;
	country: string;
	ticketUrl: string | null;
	description: string | null;
};

const EVENT_STATUS = {
	scheduled: 'https://schema.org/EventScheduled',
	cancelled: 'https://schema.org/EventCancelled',
	postponed: 'https://schema.org/EventPostponed'
} as const;

export function musicEventLd(event: EventLdInput, url: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'MusicEvent',
		name: event.title,
		url,
		startDate: event.startsAt.toISOString(),
		...(event.endsAt && { endDate: event.endsAt.toISOString() }),
		eventStatus: EVENT_STATUS[event.status],
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		location: {
			'@type': 'Place',
			name: event.venueName,
			address: {
				'@type': 'PostalAddress',
				...(event.street && { streetAddress: event.street }),
				...(event.postalCode && { postalCode: event.postalCode }),
				addressLocality: event.city,
				addressCountry: event.country
			}
		},
		performer: { '@type': 'Person', name: 'Matthias Brodbeck', url: SITE_URL },
		...(event.description && { description: event.description }),
		...(event.ticketUrl && { offers: { '@type': 'Offer', url: event.ticketUrl } })
	};
}
