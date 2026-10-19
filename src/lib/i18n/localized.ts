import { z } from 'zod';
import type { Locale } from '$lib/paraglide/runtime';

/** Text entered in the admin area, in as many languages as Matthias fills in. German is required. */
export type LocalizedText = Partial<Record<Locale, string>>;

export const localizedTextSchema = z.object({
	'de-ch': z.string().trim().max(4000).optional(),
	en: z.string().trim().max(4000).optional(),
	ja: z.string().trim().max(4000).optional()
});

// Japanese readers are more likely to read English than Swiss German.
const FALLBACKS: Record<Locale, Locale[]> = {
	'de-ch': ['de-ch', 'en', 'ja'],
	en: ['en', 'de-ch', 'ja'],
	ja: ['ja', 'en', 'de-ch']
};

/** The best available translation and the language it is actually in (for the `lang` attribute). */
export function pickLocale(
	text: LocalizedText | null | undefined,
	locale: Locale
): { value: string; lang: Locale } | null {
	for (const candidate of FALLBACKS[locale]) {
		const value = text?.[candidate]?.trim();
		if (value) return { value, lang: candidate };
	}
	return null;
}
