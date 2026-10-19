import { asc, desc, eq, gt, lt, max, sql } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { ReleaseRow, VideoRow } from './db/schema';
import { deleteFile, putFile } from './storage';

const { video, release, media } = schema;

// Videos

export async function listVideos(publishedOnly: boolean): Promise<VideoRow[]> {
	const db = await getDb();
	return db
		.select()
		.from(video)
		.where(publishedOnly ? eq(video.published, true) : undefined)
		.orderBy(asc(video.sortOrder), asc(video.id));
}

async function fetchWithTimeout(url: string) {
	return fetch(url, { signal: AbortSignal.timeout(5000) });
}

/** The video title from YouTube's oEmbed endpoint, or null if YouTube cannot be reached. */
async function fetchYouTubeTitle(id: string): Promise<string | null> {
	try {
		const response = await fetchWithTimeout(
			`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`
		);
		if (!response.ok) return null;
		const data = (await response.json()) as { title?: string };
		return data.title?.trim() || null;
	} catch {
		return null;
	}
}

/** Copies the thumbnail into our storage; returns nulls when YouTube cannot be reached. */
async function storeThumbnail(id: string) {
	try {
		const response = await fetchWithTimeout(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
		if (!response.ok) return { thumbnailUrl: null, thumbnailKey: null };
		const stored = await putFile(`videos/${id}.jpg`, await response.arrayBuffer(), 'image/jpeg');
		return { thumbnailUrl: stored.url, thumbnailKey: stored.key };
	} catch {
		return { thumbnailUrl: null, thumbnailKey: null };
	}
}

export type AddVideoResult = { ok: true } | { ok: false; error: string };

export async function addVideo(youtubeId: string, title: string | null): Promise<AddVideoResult> {
	const db = await getDb();
	const [existing] = await db.select().from(video).where(eq(video.youtubeId, youtubeId));
	if (existing) return { ok: false, error: 'Dieses Video ist schon eingetragen.' };

	const finalTitle = title || (await fetchYouTubeTitle(youtubeId));
	if (!finalTitle) {
		return { ok: false, error: 'YouTube ist nicht erreichbar. Bitte den Titel selbst eingeben.' };
	}

	const [{ last }] = await db.select({ last: max(video.sortOrder) }).from(video);
	await db.insert(video).values({
		youtubeId,
		title: finalTitle,
		...(await storeThumbnail(youtubeId)),
		sortOrder: (last ?? 0) + 1
	});
	return { ok: true };
}

export async function setVideoPublished(id: number, published: boolean): Promise<void> {
	const db = await getDb();
	await db.update(video).set({ published }).where(eq(video.id, id));
}

export async function moveVideo(id: number, direction: 'up' | 'down'): Promise<void> {
	const db = await getDb();
	const [current] = await db.select().from(video).where(eq(video.id, id));
	if (!current) return;
	const [neighbour] = await db
		.select()
		.from(video)
		.where(
			direction === 'up'
				? lt(video.sortOrder, current.sortOrder)
				: gt(video.sortOrder, current.sortOrder)
		)
		.orderBy(direction === 'up' ? desc(video.sortOrder) : asc(video.sortOrder))
		.limit(1);
	if (!neighbour) return;
	await db.update(video).set({ sortOrder: neighbour.sortOrder }).where(eq(video.id, current.id));
	await db.update(video).set({ sortOrder: current.sortOrder }).where(eq(video.id, neighbour.id));
}

export async function deleteVideo(id: number): Promise<void> {
	const db = await getDb();
	const [row] = await db.delete(video).where(eq(video.id, id)).returning();
	if (row?.thumbnailKey) await deleteFile(row.thumbnailKey);
}

// Releases

export type ReleaseWithCover = ReleaseRow & {
	cover: { url: string; width: number; height: number } | null;
};

export async function listReleases(publishedOnly: boolean): Promise<ReleaseWithCover[]> {
	const db = await getDb();
	const rows = await db
		.select({ release, cover: { url: media.url, width: media.width, height: media.height } })
		.from(release)
		.leftJoin(media, eq(release.coverMediaId, media.id))
		.where(publishedOnly ? eq(release.published, true) : undefined)
		.orderBy(sql`${release.year} desc nulls last`, desc(release.id));
	return rows.map((row) => ({ ...row.release, cover: row.cover?.url ? row.cover : null }));
}

export async function getRelease(id: number): Promise<ReleaseRow | undefined> {
	const db = await getDb();
	const [row] = await db.select().from(release).where(eq(release.id, id));
	return row;
}

type ReleaseInput = Omit<ReleaseRow, 'id' | 'createdAt'>;

export async function createRelease(values: ReleaseInput): Promise<void> {
	const db = await getDb();
	await db.insert(release).values(values);
}

export async function updateRelease(id: number, values: ReleaseInput): Promise<void> {
	const db = await getDb();
	await db.update(release).set(values).where(eq(release.id, id));
}

export async function deleteRelease(id: number): Promise<void> {
	const db = await getDb();
	await db.delete(release).where(eq(release.id, id));
}
