// Site-wide facts. Placeholders are marked TODO and must be replaced before launch.

// TODO: replace with the real domain once it is registered (used for canonical URLs, sitemap, OG tags).
export const SITE_URL = 'https://matthias-brodbeck.example';

// TODO: replace with Matthias's public contact address.
export const CONTACT_EMAIL = 'kontakt@matthias-brodbeck.example';

export const SOCIAL_LINKS = [
	{ platform: 'Instagram', href: 'https://www.instagram.com/brodbeckmatthias/' },
	{ platform: 'YouTube', href: 'https://www.youtube.com/@matthiasbrodbeck7950' },
	{ platform: 'Facebook', href: 'https://www.facebook.com/matthias.brodbeck.7' }
] as const;

export type SocialPlatform = (typeof SOCIAL_LINKS)[number]['platform'];

export function socialHref(platform: SocialPlatform): string {
	return SOCIAL_LINKS.find((link) => link.platform === platform)!.href;
}

// Public routes in navigation order; also drives the sitemap.
export const PUBLIC_ROUTES = [
	'/',
	'/events',
	'/music',
	'/gallery',
	'/about',
	'/teaching',
	'/contact',
	'/impressum',
	'/privacy'
] as const;
