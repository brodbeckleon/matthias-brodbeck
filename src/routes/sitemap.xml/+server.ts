import { baseLocale, locales, type Locale } from '$lib/paraglide/runtime';
import { toBcp47 } from '$lib/i18n/format';
import { absoluteUrl } from '$lib/seo/url';
import { listPast, listUpcoming } from '$lib/server/events';
import { PUBLIC_ROUTES } from '$lib/site';

// Rendered on request so published concerts appear; cached at the CDN for an hour.
export const prerender = false;

function entry(path: string) {
	const link = (hreflang: string, href: string) =>
		`<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
	const alternates =
		locales.map((alt) => link(toBcp47(alt), absoluteUrl(path, alt))).join('') +
		link('x-default', absoluteUrl(path, baseLocale as Locale));
	return locales.map((locale) => `<url><loc>${absoluteUrl(path, locale)}</loc>${alternates}</url>`);
}

export async function GET() {
	const now = new Date();
	const events = [...(await listUpcoming(now)), ...(await listPast(now))];
	const paths = [...PUBLIC_ROUTES, ...events.map((event) => `/events/${event.slug}`)];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.flatMap(entry).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml',
			'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
		}
	});
}
