import { z } from 'zod';
import { isTimeZone, nextDay, zonedToUtc } from './time';

// Admin-only, so validation messages are German.
const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max, `Höchstens ${max} Zeichen.`)
		.transform((value) => value || null);

const optionalUrl = z
	.string()
	.trim()
	.refine(
		(value) => !value || /^https?:\/\/\S+\.\S+/.test(value),
		'Bitte eine Adresse mit https:// eingeben.'
	)
	.transform((value) => value || null);

export const eventFormSchema = z.object({
	title: z.string().trim().min(1, 'Bitte einen Titel eingeben.').max(200, 'Höchstens 200 Zeichen.'),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte ein Datum wählen.'),
	startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Bitte eine Anfangszeit wählen.'),
	endTime: z
		.string()
		.regex(/^(\d{2}:\d{2})?$/, 'Ungültige Zeit.')
		.transform((value) => value || null),
	timezone: z.string().refine(isTimeZone, 'Unbekannte Zeitzone.'),
	venueName: z.string().trim().min(1, 'Bitte den Ort eingeben.').max(200, 'Höchstens 200 Zeichen.'),
	street: optionalText(200),
	postalCode: optionalText(20),
	city: z.string().trim().min(1, 'Bitte die Stadt eingeben.').max(100, 'Höchstens 100 Zeichen.'),
	country: z
		.string()
		.trim()
		.toUpperCase()
		.regex(/^[A-Z]{2}$/, 'Zweistelliger Ländercode, z. B. CH.'),
	venueUrl: optionalUrl,
	ticketUrl: optionalUrl,
	lineup: optionalText(500),
	descriptionDe: optionalText(4000),
	descriptionEn: optionalText(4000),
	descriptionJa: optionalText(4000),
	status: z.enum(['scheduled', 'cancelled', 'postponed']),
	published: z.boolean()
});

export type EventFormValues = Record<keyof z.input<typeof eventFormSchema>, string>;
export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export const EMPTY_EVENT_FORM: EventFormValues = {
	title: '',
	date: '',
	startTime: '20:00',
	endTime: '',
	timezone: 'Europe/Zurich',
	venueName: '',
	street: '',
	postalCode: '',
	city: '',
	country: 'CH',
	venueUrl: '',
	ticketUrl: '',
	lineup: '',
	descriptionDe: '',
	descriptionEn: '',
	descriptionJa: '',
	status: 'scheduled',
	published: ''
};

/** Parses the submitted form into database values, or returns field errors and the raw input. */
export function parseEventForm(formData: FormData) {
	const raw = Object.fromEntries(
		Object.keys(EMPTY_EVENT_FORM).map((key) => [key, String(formData.get(key) ?? '')])
	) as EventFormValues;

	const result = eventFormSchema.safeParse({ ...raw, published: raw.published === 'on' });
	if (!result.success) {
		const errors: EventFormErrors = {};
		for (const issue of result.error.issues) {
			const key = issue.path[0] as keyof EventFormValues;
			errors[key] ??= issue.message;
		}
		return { ok: false as const, values: raw, errors };
	}

	const data = result.data;
	const startsAt = zonedToUtc(data.date, data.startTime, data.timezone);
	let endsAt = data.endTime ? zonedToUtc(data.date, data.endTime, data.timezone) : null;
	// An end time before the start means the concert runs past midnight. The next calendar day is
	// converted on its own, so a DST change that night does not shift the end by an hour.
	if (endsAt && endsAt <= startsAt) {
		endsAt = zonedToUtc(nextDay(data.date), data.endTime!, data.timezone);
	}

	return {
		ok: true as const,
		values: raw,
		event: {
			title: data.title,
			startsAt,
			endsAt,
			timezone: data.timezone,
			venueName: data.venueName,
			street: data.street,
			postalCode: data.postalCode,
			city: data.city,
			country: data.country,
			venueUrl: data.venueUrl,
			ticketUrl: data.ticketUrl,
			lineup: data.lineup,
			description: {
				...(data.descriptionDe && { 'de-ch': data.descriptionDe }),
				...(data.descriptionEn && { en: data.descriptionEn }),
				...(data.descriptionJa && { ja: data.descriptionJa })
			},
			status: data.status,
			published: data.published
		}
	};
}
