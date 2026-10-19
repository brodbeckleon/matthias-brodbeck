import { env } from '$env/dynamic/private';

type Mail = { subject: string; text: string; replyTo: string };

/**
 * Sends a notification through Resend's HTTP API. Returns an error message instead of throwing,
 * because a failed email must never lose the stored message.
 */
export async function sendMail({ subject, text, replyTo }: Mail): Promise<string | null> {
	if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
		return 'Email not configured';
	}

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${env.RESEND_API_KEY}`,
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				from: env.CONTACT_FROM_EMAIL,
				to: env.CONTACT_TO_EMAIL,
				reply_to: replyTo,
				// Header injection guard: subjects come partly from visitor input.
				subject: subject.replace(/[\r\n]+/g, ' ').slice(0, 200),
				text
			})
		});
		return response.ok
			? null
			: `Resend ${response.status}: ${(await response.text()).slice(0, 500)}`;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
}
