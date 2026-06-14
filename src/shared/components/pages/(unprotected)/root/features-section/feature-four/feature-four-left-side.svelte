<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';

	// UTILS
	import { formatAnalyticsType } from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// DATA
	import { landingOwnerFeaturesPartnershipPartners } from '@/shared/data/dummyData';
</script>

<div class="relative" aria-label="Example partnership benefits">
	<div
		class="pointer-events-none absolute inset-x-6 top-10 h-48 rounded-full bg-primary/10 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto w-full max-w-xl lg:mx-0">
		<Card
			class="overflow-hidden rounded-2xl border border-border-2 bg-card py-0 shadow-dashboard-card"
		>
			<CardHeader
				class="flex flex-row items-start justify-between gap-3 border-b border-border-2 px-4 py-4 sm:px-5"
			>
				<div class="min-w-0">
					<CardTitle class="text-base">Partnerships</CardTitle>
					<CardDescription>Benefits guests unlock on this stay.</CardDescription>
				</div>

				<Badge variant="success">Free</Badge>
			</CardHeader>

			<CardContent class="px-3 pt-3 pb-4 sm:px-4">
				<ul class="grid gap-2.5">
					{#each landingOwnerFeaturesPartnershipPartners as partner (partner.id)}
						<li
							class="flex items-center gap-3 rounded-xl border border-border-2 bg-background px-3 py-2.5"
						>
							<img
								src={partner.image}
								alt={partner.name}
								class="size-10 shrink-0 rounded-lg border border-border-2 object-cover"
								loading="lazy"
								decoding="async"
							/>

							<div class="min-w-0 flex-1">
								<p class="mb-0 truncate text-sm font-medium text-foreground">{partner.name}</p>
								<p class="mb-0 truncate text-xs text-muted-foreground">
									{formatAnalyticsType(partner.type)}
								</p>
							</div>

							<Badge variant={partner.offerKind === 'discount' ? 'default' : 'secondary'}>
								{partner.offer}
							</Badge>
						</li>
					{/each}
				</ul>
			</CardContent>
		</Card>
	</div>
</div>
