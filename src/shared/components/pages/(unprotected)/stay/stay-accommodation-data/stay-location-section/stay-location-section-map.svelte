<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import GoogleMap from '@/shared/components/ui/google-map/google-map.svelte';
	import CustomMarker from '@/shared/components/ui/google-map/custom-marker.svelte';
	import StayLocationMapCardOverlay from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-location-section/stay-location-map-card-overlay.svelte';

	// UTILS
	import { distanceMeters, formatDistance } from '@/utils/distance';

	// TYPES
	import type {
		GoogleMapHandle,
		GoogleMapMarkerContext
	} from '@/shared/components/ui/google-map/types.js';
	import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	// LUCIDE ICONS
	import HouseIcon from '@lucide/svelte/icons/house';

	let {
		latitude,
		longitude,
		accommodationId,
		accommodationName,
		partnerships,
		focusedId = null
	}: {
		latitude: number;
		longitude: number;
		accommodationId: string;
		accommodationName: string;
		partnerships: AccommodationPartnershipSafe[];
		/** Hospitality id the guest is hovering on a card — the map pans/highlights its pin. */
		focusedId?: string | null;
	} = $props();

	type StayMarker = {
		id: string;
		lat: number;
		lng: number;
		title: string;
		kind: 'accommodation' | 'partner';
		distanceLabel?: string;
	};

	const markers = $derived<StayMarker[]>([
		{
			id: accommodationId,
			lat: latitude,
			lng: longitude,
			title: accommodationName,
			kind: 'accommodation'
		},
		...partnerships
			.filter(
				(p) =>
					typeof p.hospitality.latitude === 'number' &&
					typeof p.hospitality.longitude === 'number'
			)
			.map((p): StayMarker => {
				const lat = p.hospitality.latitude as number;
				const lng = p.hospitality.longitude as number;
				return {
					id: p.hospitality._id,
					lat,
					lng,
					title: p.hospitality.name,
					kind: 'partner',
					distanceLabel: formatDistance(distanceMeters(latitude, longitude, lat, lng))
				};
			})
	]);

	let mapRef = $state<GoogleMapHandle>();
	let selectedPartnerId = $state<string | null>(null);

	const selectedPartnership = $derived(
		selectedPartnerId
			? (partnerships.find((p) => p.hospitality._id === selectedPartnerId) ?? null)
			: null
	);

	const selectedHospitality = $derived(selectedPartnership?.hospitality ?? null);

	const selectedBenefit = $derived.by(() => {
		if (!selectedPartnership) return null;
		return (
			selectedPartnership.benefit ??
			(selectedPartnership.discountPercentage == null
				? null
				: `${selectedPartnership.discountPercentage}% ${m['StayPage.StayPartnershipsSectionItem.off']()}`)
		);
	});

	const selectedDistanceLabel = $derived.by(() => {
		const h = selectedHospitality;
		if (!h || typeof h.latitude !== 'number' || typeof h.longitude !== 'number') return null;
		return formatDistance(distanceMeters(latitude, longitude, h.latitude, h.longitude));
	});

	$effect(() => {
		mapRef?.setFocus(focusedId);
	});

	$effect(() => {
		if (
			selectedPartnerId &&
			!partnerships.some((p) => p.hospitality._id === selectedPartnerId)
		) {
			clearSelection();
		}
	});

	function clearSelection() {
		selectedPartnerId = null;
		mapRef?.setSelected(null);
	}

	function handleMarkerClick(item: StayMarker) {
		if (item.kind !== 'partner') return;

		if (selectedPartnerId === item.id) {
			clearSelection();
			return;
		}

		selectedPartnerId = item.id;
		mapRef?.setSelected(item.id);
	}

	function isPartnerHighlighted(item: StayMarker, context: GoogleMapMarkerContext) {
		return context.highlightedId === item.id || context.selectedId === item.id;
	}
</script>

<GoogleMap
	bind:this={mapRef}
	center={{ lat: latitude, lng: longitude }}
	{markers}
	fitBounds={{ maxZoom: 15, padding: 56 }}
	onMarkerClick={handleMarkerClick}
	class="aspect-4/3 h-auto rounded-lg border lg:aspect-square"
>
	{#snippet markerContent(item: StayMarker, context: GoogleMapMarkerContext)}
		{#if item.kind === 'accommodation'}
			<CustomMarker variant="selected">
				<span class="inline-flex items-center gap-1">
					<HouseIcon class="size-3.5" aria-hidden="true" />
					{m['StayPage.StayLocationSection.yourStay']()}
				</span>
			</CustomMarker>
		{:else if isPartnerHighlighted(item, context)}
			<CustomMarker shape="rect" variant="selected">
				<span class="inline-flex items-center gap-1.5">
					<span>{item.title}</span>
					{#if item.distanceLabel}
						<span class="opacity-80">· {item.distanceLabel}</span>
					{/if}
				</span>
			</CustomMarker>
		{:else}
			<CustomMarker shape="rect" variant="default">
				{item.distanceLabel ?? item.title}
			</CustomMarker>
		{/if}
	{/snippet}

	{#snippet overlay()}
		{#if selectedHospitality && selectedPartnership}
			<StayLocationMapCardOverlay
				hospitality={selectedHospitality}
				benefit={selectedBenefit}
				distanceLabel={selectedDistanceLabel}
				onClose={clearSelection}
			/>
		{/if}
	{/snippet}
</GoogleMap>
