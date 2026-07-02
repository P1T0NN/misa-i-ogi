<script lang="ts">
	let { item, index }: { item: string; index: number } = $props();
</script>

<li class="border-t border-ivory/10 pt-6">
	<span class="font-mono text-xs tracking-caps text-accent-2">
		0{index + 1}
	</span>

	<p class="mt-3 mb-0 font-display text-xl leading-snug font-medium text-ivory sm:text-phone-stat">
		{item}
	</p>
</li>
