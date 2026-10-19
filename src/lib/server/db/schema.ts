import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import type { LocalizedText } from '../../i18n/localized';

const timestamps = {
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};

/** Admin sessions. `id` is the SHA-256 of the cookie token, so a database leak cannot be replayed. */
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const rateLimit = pgTable('rate_limit', {
	key: text('key').primaryKey(),
	count: integer('count').notNull(),
	resetAt: timestamp('reset_at', { withTimezone: true }).notNull()
});

export const eventStatus = pgEnum('event_status', ['scheduled', 'cancelled', 'postponed']);

export const event = pgTable(
	'event',
	{
		id: serial('id').primaryKey(),
		/** Public URL segment; fixed once the event has been published. */
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
		endsAt: timestamp('ends_at', { withTimezone: true }),
		/** IANA zone the times were entered in; dates are shown in this zone. */
		timezone: text('timezone').notNull().default('Europe/Zurich'),
		venueName: text('venue_name').notNull(),
		street: text('street'),
		postalCode: text('postal_code'),
		city: text('city').notNull(),
		country: text('country').notNull().default('CH'),
		venueUrl: text('venue_url'),
		ticketUrl: text('ticket_url'),
		lineup: text('lineup'),
		description: jsonb('description').$type<LocalizedText>().notNull().default({}),
		status: eventStatus('status').notNull().default('scheduled'),
		published: boolean('published').notNull().default(false),
		publishedAt: timestamp('published_at', { withTimezone: true }),
		deletedAt: timestamp('deleted_at', { withTimezone: true }),
		...timestamps
	},
	(table) => [index('event_public_idx').on(table.published, table.startsAt)]
);

export const contactTopic = pgEnum('contact_topic', [
	'booking',
	'session',
	'lessons',
	'press',
	'other'
]);

export const messageStatus = pgEnum('message_status', ['new', 'read', 'archived']);

/** Contact form submissions. Kept for twelve months, then purged. */
export const contactMessage = pgTable(
	'contact_message',
	{
		id: serial('id').primaryKey(),
		topic: contactTopic('topic').notNull(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		message: text('message').notNull(),
		eventDate: text('event_date'),
		eventLocation: text('event_location'),
		locale: text('locale').notNull(),
		ipHash: text('ip_hash').notNull(),
		status: messageStatus('status').notNull().default('new'),
		emailSentAt: timestamp('email_sent_at', { withTimezone: true }),
		emailError: text('email_error'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [index('contact_message_status_idx').on(table.status, table.createdAt)]
);

export type EventRow = typeof event.$inferSelect;
export type NewEventRow = typeof event.$inferInsert;
export type ContactMessageRow = typeof contactMessage.$inferSelect;
