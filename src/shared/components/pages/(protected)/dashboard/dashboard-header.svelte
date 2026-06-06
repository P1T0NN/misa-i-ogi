<script lang="ts">
    // CONFIG
    import { COMPANY_DATA } from "@/shared/constants.js";
</script>

<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
	<div class="flex max-w-3xl flex-col gap-2">
		<p class="text-xs font-medium text-primary uppercase">Partner dashboard</p>
		<h1 class="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
		<p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
			A quick overview of guest activity, reservation requests, and connected places.
			{COMPANY_DATA.NAME} still manages setup and listing changes.
		</p>
	</div>
</header>
