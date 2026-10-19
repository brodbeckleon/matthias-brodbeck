import type { SubmitFunction } from '@sveltejs/kit';
import { tick } from 'svelte';

/**
 * use:enhance handler for list actions (move, publish, delete …). SvelteKit moves focus to the
 * page top after an enhanced action; this puts it back on the button that was pressed, so keyboard
 * users can press it again (e.g. to keep moving a photo). If that button is gone, focus goes to
 * the same row, then to an element marked data-focus-fallback, then to <main>.
 */
export const keepFocus: SubmitFunction = ({ formElement, submitter }) => {
	const id = formElement.querySelector<HTMLInputElement>('input[name="id"]')?.value;
	const action = submitter?.getAttribute('formaction') ?? '';
	const value = submitter?.getAttribute('value') ?? '';

	return async ({ update }) => {
		await update({ reset: false });
		await tick();
		const row = id
			? document.querySelector(`form:has(input[name="id"][value="${CSS.escape(id)}"])`)
			: null;
		const buttons = row ? [...row.querySelectorAll<HTMLElement>('button:not([disabled]), a')] : [];
		const target =
			buttons.find(
				(el) =>
					(el.getAttribute('formaction') ?? '') === action &&
					(el.getAttribute('value') ?? '') === value
			) ??
			buttons[0] ??
			document.querySelector<HTMLElement>('[data-focus-fallback]') ??
			document.querySelector<HTMLElement>('main');
		target?.focus();
	};
};

/** onclick handler for buttons that delete something for good. */
export function confirmDelete(message: string) {
	return (event: MouseEvent) => {
		if (!confirm(message)) event.preventDefault();
	};
}
