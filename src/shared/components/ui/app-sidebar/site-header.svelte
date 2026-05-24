<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA, PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/classes/breadcrumb-label.svelte.js';

	// COMPONENTS
	import * as Breadcrumb from '@/shared/components/ui/breadcrumb/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import { Separator } from '@/shared/components/ui/separator/index.js';
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';

	// UTILS
	import { deLocalizeUrl } from '@/shared/lib/paraglide/runtime';

	// LUCIDE ICONS
	import SidebarIcon from '@lucide/svelte/icons/sidebar';

	const sidebar = Sidebar.useSidebar();

	let {
		pageName,
		hidePaths = []
	}: {
		pageName?: string;
		/**
		 * Cumulative paths to omit from the rendered breadcrumb trail (e.g.
		 * `['/admin']` to hide the `Admin` crumb under the admin shell). Match is
		 * against the cumulative `href` of each segment, so `'/admin'` hides only
		 * that one crumb without affecting `/admin/users`.
		 */
		hidePaths?: string[];
	} = $props();

	type TrailItem = { label: string; href?: string };

	function labelFromSegment(segment: string) {
		return segment.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	/**
	 * Build a breadcrumb trail from every non-empty path segment. Each entry
	 * carries the cumulative `href` so intermediate items can link back. The
	 * last entry is rendered as the current page (no link).
	 */
	const trail = $derived.by((): TrailItem[] => {
		const routeId = page.route.id;
		const currentPageLabel = breadcrumbLabel.current;

		if (routeId === '/(protected)/edit-accommodation/[id]') {
			return [
				{
					label: m['ProtectedSidebar.myAccommodations'](),
					href: PROTECTED_PAGE_ENDPOINTS.MY_ACCOMMODATIONS
				},
				{
					label: currentPageLabel ?? m['EditAccommodationPage.title']()
				}
			];
		}

		if (routeId === '/(protected)/edit-hospitality/[id]') {
			return [
				{
					label: m['ProtectedSidebar.myHospitalities'](),
					href: PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES
				},
				{
					label: currentPageLabel ?? m['EditHospitalityPage.title']()
				}
			];
		}

		const pathname = deLocalizeUrl(page.url).pathname;
		const segments = pathname.split('/').filter(Boolean);
		const hidden = new Set(hidePaths);
		let href = '';
		const items: TrailItem[] = [];
		for (const segment of segments) {
			href += `/${segment}`;
			if (hidden.has(href)) continue;
			items.push({ label: labelFromSegment(segment), href });
		}
		return items;
	});

	const overridden = $derived(pageName !== undefined);
</script>

<header class="sticky top-0 z-50 flex w-full items-center border-b bg-background">
	<div class="flex h-(--header-height) w-full items-center gap-2 px-4">
		<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
			<SidebarIcon />
		</Button>

		<Separator orientation="vertical" class="me-2 h-4" />

		<Breadcrumb.Root class="hidden sm:block">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="##">{COMPANY_DATA.NAME}</Breadcrumb.Link>
				</Breadcrumb.Item>

				{#if overridden}
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{pageName}</Breadcrumb.Page>
					</Breadcrumb.Item>
				{:else}
					{#each trail as crumb, i (crumb.label + (crumb.href ?? ''))}
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							{#if crumb.href && i !== trail.length - 1}
								<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
							{:else}
								<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
							{/if}
						</Breadcrumb.Item>
					{/each}
				{/if}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>
