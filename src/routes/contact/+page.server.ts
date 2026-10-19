import { fail } from '@sveltejs/kit';
import { env as publicEnv } from '$env/dynamic/public';
import {
	contactSchema,
	isTopic,
	type ContactErrorKey,
	type ContactFields
} from '$lib/contact/form';
import { getLocale } from '$lib/paraglide/runtime';
import { sendMail } from '$lib/server/mail';
import { purgeOldMessages, recordDelivery, storeMessage } from '$lib/server/messages';
import { hashIp, hit } from '$lib/server/rate-limit';
import { verifyTurnstile } from '$lib/server/turnstile';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

const HOUR = 60 * 60 * 1000;
const FIELDS: ContactFields[] = ['topic', 'name', 'email', 'message', 'eventDate', 'eventLocation'];

const TOPIC_DE = {
	booking: 'Konzertanfrage',
	session: 'Studioaufnahme',
	lessons: 'Unterricht',
	press: 'Presse',
	other: 'Anfrage'
} as const;

export const load: PageServerLoad = ({ url }) => {
	const topic = url.searchParams.get('topic');
	return {
		topic: isTopic(topic) ? topic : 'booking',
		turnstileSiteKey: publicEnv.PUBLIC_TURNSTILE_SITE_KEY || null
	};
};

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const values = Object.fromEntries(
			FIELDS.map((field) => [field, String(data.get(field) ?? '')])
		) as Record<ContactFields, string>;

		// Honeypot: bots fill every field. Pretend success so they do not adapt.
		if (data.get('website')) return { sent: true };

		const parsed = contactSchema.safeParse(values);
		if (!parsed.success) {
			const errors: Partial<Record<ContactFields, ContactErrorKey>> = {};
			for (const issue of parsed.error.issues) {
				const field = issue.path[0] as ContactFields;
				errors[field] ??= issue.message as ContactErrorKey;
			}
			return fail(400, { values, errors });
		}

		const ip = getClientAddress();
		const token = data.get('cf-turnstile-response');
		if (!(await verifyTurnstile(typeof token === 'string' ? token : null, ip))) {
			return fail(400, { values, error: 'error_captcha' as ContactErrorKey });
		}

		const ipHash = hashIp(ip);
		if (!(await hit(`contact:${ipHash}`, 5, HOUR))) {
			return fail(429, { values, error: 'error_too_many' as ContactErrorKey });
		}

		const message = parsed.data;
		const row = await storeMessage({ ...message, locale: getLocale(), ipHash });

		const details = [
			`Name: ${message.name}`,
			`E-Mail: ${message.email}`,
			`Thema: ${TOPIC_DE[message.topic]}`,
			message.eventDate && `Datum: ${message.eventDate}`,
			message.eventLocation && `Ort: ${message.eventLocation}`,
			`Sprache der Website: ${getLocale()}`
		].filter(Boolean);
		const error = await sendMail({
			subject: `[${TOPIC_DE[message.topic]}] ${message.name}${message.eventDate ? ` – ${message.eventDate}` : ''}`,
			text: `${details.join('\n')}\n\n${message.message}\n\n--\nAntworten Sie direkt auf diese E-Mail. Alle Nachrichten: /admin/messages`,
			replyTo: message.email
		});
		await recordDelivery(row.id, error);
		// Keeps the twelve-month promise even if nobody opens the admin inbox.
		await purgeOldMessages();

		return { sent: true };
	}
};
