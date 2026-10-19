import { parseEmbedUrl } from './embeds';

export const RELEASE_FIELDS = [
	'title',
	'artist',
	'year',
	'label',
	'role',
	'coverMediaId',
	'links',
	'embed',
	'published'
] as const;

export type ReleaseFormValues = Record<(typeof RELEASE_FIELDS)[number], string>;
export type ReleaseFormErrors = Partial<ReleaseFormValues>;

export const EMPTY_RELEASE_FORM: ReleaseFormValues = {
	title: '',
	artist: '',
	year: '',
	label: '',
	role: '',
	coverMediaId: '',
	links: '',
	embed: '',
	published: 'on'
};

/**
 * Links are entered one per line as "Name | https://…", e.g. "Bandcamp | https://…".
 * Admin-only, so messages are German.
 */
export function parseReleaseForm(data: FormData) {
	const values = Object.fromEntries(
		RELEASE_FIELDS.map((field) => [field, String(data.get(field) ?? '').trim()])
	) as ReleaseFormValues;
	const errors: ReleaseFormErrors = {};

	if (!values.title) errors.title = 'Bitte einen Titel eingeben.';
	if (!values.artist) errors.artist = 'Bitte Band oder Künstler eingeben.';

	const year = values.year ? Number(values.year) : null;
	if (year !== null && !(Number.isInteger(year) && year >= 1950 && year <= 2100)) {
		errors.year = 'Bitte ein Jahr wie 2019 eingeben.';
	}

	const links = values.links
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [label, url] = line.includes('|') ? line.split('|').map((s) => s.trim()) : ['', line];
			return { label: label || hostLabel(url), url };
		});
	if (links.some((link) => !/^https:\/\/\S+\.\S+/.test(link.url))) {
		errors.links = 'Jede Zeile braucht eine Adresse mit https://, z. B. «Bandcamp | https://…».';
	}

	const coverMediaId = values.coverMediaId ? Number(values.coverMediaId) : null;
	if (coverMediaId !== null && !Number.isInteger(coverMediaId)) {
		errors.coverMediaId = 'Ungültige Auswahl.';
	}

	const embedUrl = values.embed ? parseEmbedUrl(values.embed) : null;
	if (values.embed && !embedUrl) {
		errors.embed = 'Nur Player von Bandcamp oder SoundCloud (den «Einbetten»-Code) einfügen.';
	}

	if (Object.keys(errors).length) return { ok: false as const, values, errors };

	return {
		ok: true as const,
		values,
		release: {
			title: values.title.slice(0, 200),
			artist: values.artist.slice(0, 200),
			year,
			label: values.label.slice(0, 200) || null,
			role: values.role.slice(0, 200) || null,
			coverMediaId,
			links: links.slice(0, 10),
			embedUrl,
			published: values.published === 'on'
		}
	};
}

function hostLabel(url: string) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}
