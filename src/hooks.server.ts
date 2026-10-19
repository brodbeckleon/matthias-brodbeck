import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { validateSession } from '$lib/server/auth';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

/**
 * Guards the admin area. Form actions run before any layout load, so the redirect has to happen
 * here; actions and endpoints additionally call assertAdmin().
 */
const handleAdmin: Handle = async ({ event, resolve }) => {
	event.locals.admin = null;

	// The admin area exists only unlocalized.
	if (/^\/(de-ch|ja)\/admin(\/|$)/.test(event.url.pathname)) {
		return new Response('Not found', { status: 404 });
	}

	if (!event.route.id?.startsWith('/admin')) return resolve(event);

	event.locals.admin = await validateSession(event.cookies);

	if (!event.locals.admin && event.route.id !== '/admin/login') {
		return new Response(null, { status: 303, headers: { location: '/admin/login' } });
	}

	const response = await resolve(event);
	response.headers.set('cache-control', 'private, no-store');
	response.headers.set('x-robots-tag', 'noindex, nofollow');
	return response;
};

export const handle: Handle = sequence(handleAdmin, handleParaglide);
