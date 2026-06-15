<script lang="ts">
    // TYPES
    import type { FaqItem } from './types';
    
    // LUCIDE ICONS
    import { ChevronDown } from '@lucide/svelte';

    let { faq }: { faq: FaqItem } = $props();
</script>

<details class="group border-t border-border-2">
    <summary
        class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden"
    >
        <span class="font-display text-lg leading-snug text-foreground">{faq.question}</span>

        <ChevronDown
            class="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
        />
    </summary>

    <p class="mb-0 max-w-[64ch] pb-5 text-sm leading-relaxed text-muted-foreground">
        {faq.answer}
    </p>
</details>