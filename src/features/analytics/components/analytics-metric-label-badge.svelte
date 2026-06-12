<script lang="ts">
	// LIBRARIES
	import { metricLabelSentiment, type typesAnalyticsMetricLabel } from '@piton-/analytics-convex';

	// I18N
	import { analyticsMetricLabel } from '@/features/analytics/i18n/analyticsMetricLabel';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// LUCIDE ICONS
	import ActivityIcon from '@lucide/svelte/icons/activity';

	let { analyticsLabel }: { analyticsLabel: typesAnalyticsMetricLabel } = $props();

	const label = $derived(analyticsMetricLabel(analyticsLabel));
	const sentiment = $derived(metricLabelSentiment(analyticsLabel));
</script>

{#if analyticsLabel === 'activity'}
	<Badge class="border-primary/20 bg-primary/10 text-primary">
		<ActivityIcon data-icon="inline-start" aria-hidden="true" />
		{label}
	</Badge>
{:else if sentiment === 'positive'}
	<Badge variant="success">{label}</Badge>
{:else if sentiment === 'negative'}
	<Badge variant="destructive">{label}</Badge>
{:else}
	<Badge variant="outline">{label}</Badge>
{/if}
