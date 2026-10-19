import { error } from '@sveltejs/kit';
import { eventToIcs } from '$lib/events/ics';
import { absoluteUrl } from '$lib/seo/url';
import { getPublicEvent } from '$lib/server/events';
import { SITE_URL } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async ({ params }) => {
	const event = await getPublicEvent(params.slug);
	if (!event) error(404);
	const body = eventToIcs(
		event,
		absoluteUrl(`/events/${event.slug}`, 'en'),
		new URL(SITE_URL).host
	);
	return new Response(body, {
		headers: {
			'content-type': 'text/calendar; charset=utf-8',
			'content-disposition': `attachment; filename="${event.slug}.ics"`,
			'cache-control': 'public, max-age=0, s-maxage=60'
		}
	});
};
