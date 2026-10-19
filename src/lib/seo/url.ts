import { localizePath } from '$lib/i18n/href';
import type { Locale } from '$lib/paraglide/runtime';
import { SITE_URL } from '$lib/site';

export function absoluteUrl(path: string, locale: Locale): string {
	return SITE_URL + localizePath(path, { locale });
}
