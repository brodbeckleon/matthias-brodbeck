<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { imageSrcset, imageUrl } from '$lib/image';

	type Props = Omit<HTMLImgAttributes, 'src' | 'srcset' | 'alt' | 'width' | 'height'> & {
		image: { url: string; width: number; height: number };
		/** Required: describe the photo, or pass "" only if it is purely decorative. */
		alt: string;
		sizes: string;
	};

	let { image, alt, sizes, loading = 'lazy', ...rest }: Props = $props();
</script>

<img
	src={imageUrl(image.url, Math.min(image.width, 1280))}
	srcset={imageSrcset(image.url, image.width)}
	{sizes}
	{alt}
	width={image.width}
	height={image.height}
	{loading}
	decoding="async"
	{...rest}
/>
