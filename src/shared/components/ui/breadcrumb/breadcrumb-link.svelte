<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn, type WithElementRef } from '@/shared/utils/utils.js';
	import { appHref } from '@/shared/utils/app-navigation';

	let {
		ref = $bindable(null),
		class: className,
		href = undefined,
		child,
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		child?: Snippet<[{ props: HTMLAnchorAttributes }]>;
	} = $props();

	const resolvedHref = $derived(
		href == null ? undefined : href.startsWith('/') ? appHref(href) : href
	);

	const attrs = $derived({
		'data-slot': 'breadcrumb-link',
		class: cn('hover:text-foreground transition-colors', className),
		href: resolvedHref,
		...restProps
	});
</script>

{#if child}
	{@render child({ props: attrs })}
{:else}
	<a bind:this={ref} {...attrs}>
		{@render children?.()}
	</a>
{/if}
