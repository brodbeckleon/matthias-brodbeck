import { baseLocale, locales } from '$lib/paraglide/runtime';
import { toBcp47 } from '$lib/i18n/format';
import { absoluteUrl } from '$lib/seo/url';
import { PUBLIC_ROUTES } from '$lib/site';

export const prerender = true;

export function GET() {
	const urls = PUBLIC_ROUTES.flatMap((path) =>
		locales.map((locale) => {
			const alternates =
				locales
					.map(
						(alt) =>
							`<xhtml:link rel="alternate" hreflang="${toBcp47(alt)}" href="${absoluteUrl(path, alt)}"/>`
					)
					.join('') +
				`<xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(path, baseLocale)}"/>`;
			return `<url><loc>${absoluteUrl(path, locale)}</loc>${alternates}</url>`;
		})
	);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
