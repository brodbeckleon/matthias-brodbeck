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
		// fetch() follows redirects silently, so API callers get a plain 401 instead.
		if (event.route.id.startsWith('/admin/api/')) {
			return new Response('Nicht angemeldet', { status: 401 });
		}
		return new Response(null, { status: 303, headers: { location: '/admin/login' } });
	}

	const response = await resolve(event);
	response.headers.set('cache-control', 'private, no-store');
	response.headers.set('x-robots-tag', 'noindex, nofollow');
	return response;
};

/**
 * Headers for every rendered response. Prerendered pages get their CSP from a <meta> tag instead;
 * the rest matters less there, as they hold no forms or session.
 */
const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	response.headers.set('x-frame-options', 'DENY');
	response.headers.set(
		'permissions-policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
	);
	return response;
};

export const handle: Handle = sequence(handleSecurityHeaders, handleAdmin, handleParaglide);
