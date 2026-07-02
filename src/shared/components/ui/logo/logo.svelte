<script lang="ts">
	// CONFIG
	import { COMPANY_DATA, PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import Link from '@/shared/components/ui/link/link.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// TYPES
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = {
		class?: string;
		/** Passed through to `<img>` (e.g. brightness on dark heroes). */
		imgClass?: string;
		href?: string;
		alt?: string;
		/** Visual size in the header / drawer. */
		size?: 'sm' | 'md';
		/** Show the company name beside the mark in one link. */
		withText?: boolean;
		/** Wordmark label when `withText` is true. Defaults to `COMPANY_DATA.NAME`. */
		name?: string;
	} & Omit<HTMLAnchorAttributes, 'href' | 'class' | 'children'>;

	let {
		class: className,
		imgClass,
		href = PROTECTED_PAGE_ENDPOINTS.DASHBOARD,
		alt = `${COMPANY_DATA.NAME} logo`,
		size = 'md',
		withText = false,
		name = COMPANY_DATA.NAME,
		...restProps
	}: Props = $props();

	const markSizeStyles = $derived(
		withText
			? size === 'sm'
				? 'size-7 shrink-0'
				: 'size-8 shrink-0'
			: size === 'sm'
				? 'h-7 max-h-7 w-auto max-w-[min(9rem,40vw)]'
				: 'h-8 max-h-9 w-auto max-w-[min(10rem,45vw)]'
	);

	const wordmarkClass = $derived(
		size === 'sm'
			? 'truncate text-sm font-semibold tracking-tight text-foreground'
			: 'truncate text-sm font-semibold tracking-tight text-foreground sm:text-base'
	);

	const imageAlt = $derived(withText ? '' : alt);
	const linkAriaLabel = $derived(withText ? name : undefined);
</script>

<Link
	{href}
	aria-label={linkAriaLabel}
	class={cn(
		'inline-flex min-w-0 shrink-0 items-center rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
		withText && 'gap-2.5',
		className
	)}
	{...restProps}
>
	<img
		src={COMPANY_DATA.LOGO}
		alt={imageAlt}
		class={cn('object-contain object-left', markSizeStyles, imgClass)}
		width={withText ? 32 : 160}
		height={withText ? 32 : 36}
		loading="eager"
		decoding="async"
		draggable="false"
	/>
	{#if withText}
		<span class={wordmarkClass}>{name}</span>
	{/if}
</Link>
