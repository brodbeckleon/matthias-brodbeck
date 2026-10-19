import { localizeHref } from '$lib/paraglide/runtime';

/**
 * localizeHref without the trailing slash it adds to locale roots ("/de-ch/" → "/de-ch"), so
 * internal links match the canonical URLs and the prerendered files.
 */
export function localizePath(...args: Parameters<typeof localizeHref>): string {
	return localizeHref(...args).replace(/(.)\/(?=$|[?#])/, '$1');
}
