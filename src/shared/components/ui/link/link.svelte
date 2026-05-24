<script lang="ts">
	// UTILS
	import { cn, type WithElementRef } from '@/shared/utils/utils.js';
	import { appHref } from '@/shared/utils/app-navigation';

	// TYPES
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type LinkProps = WithElementRef<
		Omit<HTMLAnchorAttributes, 'href'> & {
			/** Canonical app path (e.g. `/demo`). Locale prefix is added via `localizeHref`. */
			href: string;
			children: Snippet;
		}
	>;

	let {
		class: className,
		href,
		ref = $bindable(null),
		children,
		...restProps
	}: LinkProps = $props();
</script>

<a bind:this={ref} data-slot="link" href={appHref(href)} class={cn(className)} {...restProps}>
	{@render children()}
</a>
