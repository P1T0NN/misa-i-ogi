<script lang="ts">
	// LIBRARIES
	import {
		ANALYTICS_METRIC_LABELS,
		metricLabelSentiment,
		type typesAnalyticsMetricLabel
	} from '@piton-/analytics-convex';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// LUCIDE ICONS
	import ActivityIcon from '@lucide/svelte/icons/activity';

	let { analyticsLabel }: { analyticsLabel: typesAnalyticsMetricLabel } = $props();

	const label = $derived(ANALYTICS_METRIC_LABELS[analyticsLabel]);
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
