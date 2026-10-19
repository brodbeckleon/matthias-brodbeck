import type { Locale } from '$lib/paraglide/runtime';

const BCP47: Record<Locale, string> = {
	en: 'en',
	'de-ch': 'de-CH',
	ja: 'ja'
};

const OG_LOCALE: Record<Locale, string> = {
	en: 'en_GB',
	'de-ch': 'de_CH',
	ja: 'ja_JP'
};

export function toBcp47(locale: Locale): string {
	return BCP47[locale];
}

export function toOgLocale(locale: Locale): string {
	return OG_LOCALE[locale];
}

export const LOCALE_NAMES: Record<Locale, string> = {
	en: 'English',
	'de-ch': 'Deutsch',
	ja: '日本語'
};
