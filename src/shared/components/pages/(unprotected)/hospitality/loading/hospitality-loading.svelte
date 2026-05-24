<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<div>
	<Skeleton
		class="aspect-16/10 w-full max-lg:max-h-[min(52vh,24rem)] lg:mx-auto lg:mt-6 lg:max-h-[min(70vh,32rem)] lg:max-w-7xl lg:rounded-2xl"
	/>
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<Skeleton class="mb-6 h-10 max-w-md" />
		<Skeleton class="mb-3 h-4 w-full max-w-xl" />
		<Skeleton class="mb-3 h-4 w-full max-w-lg" />
		<Skeleton class="h-4 w-2/3 max-w-md" />
	</div>
</div>
<p class="sr-only" aria-live="polite">{m['HospitalityPage.HospitalityLoading.announce']()}</p>
