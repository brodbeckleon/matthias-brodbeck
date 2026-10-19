import { TZDate } from '@date-fns/tz';

/** Wall-clock date ("2026-11-14") and time ("20:00") in `timeZone`, as an absolute instant. */
export function zonedToUtc(date: string, time: string, timeZone: string): Date {
	const [year, month, day] = date.split('-').map(Number);
	const [hour, minute] = time.split(':').map(Number);
	return new Date(new TZDate(year, month - 1, day, hour, minute, timeZone).getTime());
}

/** The inverse of zonedToUtc, for filling the edit form. */
export function utcToZoned(instant: Date, timeZone: string): { date: string; time: string } {
	const zoned = new TZDate(instant.getTime(), timeZone);
	const pad = (n: number) => String(n).padStart(2, '0');
	return {
		date: `${zoned.getFullYear()}-${pad(zoned.getMonth() + 1)}-${pad(zoned.getDate())}`,
		time: `${pad(zoned.getHours())}:${pad(zoned.getMinutes())}`
	};
}

/** "2026-03-28" → "2026-03-29", independent of time zones. */
export function nextDay(date: string): string {
	const [year, month, day] = date.split('-').map(Number);
	return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

export function isTimeZone(value: string): boolean {
	try {
		new Intl.DateTimeFormat('en', { timeZone: value });
		return true;
	} catch {
		return false;
	}
}
