import { z } from 'zod';

export const CONTACT_TOPICS = ['booking', 'session', 'lessons', 'press', 'other'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export function isTopic(value: unknown): value is ContactTopic {
	return CONTACT_TOPICS.includes(value as ContactTopic);
}

/**
 * Error messages are message keys, translated where they are shown, so the same schema serves
 * every locale on the server.
 */
export const contactSchema = z.object({
	topic: z.enum(CONTACT_TOPICS).catch('other'),
	name: z.string().trim().min(1, 'error_name_required').max(200, 'error_name_required'),
	email: z.string().trim().max(320, 'error_email_invalid').pipe(z.email('error_email_invalid')),
	message: z.string().trim().min(1, 'error_message_required').max(5000, 'error_message_too_long'),
	eventDate: z
		.string()
		.trim()
		.max(100)
		.transform((value) => value || null),
	eventLocation: z
		.string()
		.trim()
		.max(200)
		.transform((value) => value || null)
});

export type ContactFields = 'topic' | 'name' | 'email' | 'message' | 'eventDate' | 'eventLocation';
export type ContactErrorKey =
	| 'error_name_required'
	| 'error_email_invalid'
	| 'error_message_required'
	| 'error_message_too_long'
	| 'error_too_many'
	| 'error_captcha';
