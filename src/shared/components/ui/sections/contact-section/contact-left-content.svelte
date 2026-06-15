<script lang="ts">
	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import MailIcon from '@lucide/svelte/icons/mail';
</script>

<div>
	<p class="landing-section-eyebrow mb-3 text-accent-2">Contact</p>

	<h2
		id="contact-heading"
		class="max-w-[11ch] font-display text-4xl leading-[1.05] font-medium text-ivory md:text-5xl"
	>
		Plan your<br />
		<span class="text-accent-2">guest network</span>
	</h2>

	<p class="mt-6 max-w-sm text-base leading-relaxed text-silver">
		Large operators, boutique accommodations, restaurants, bars, spas, tours, and local experiences can all
		enter through the same conversation.
	</p>

	<div class="my-10 h-px bg-linear-to-r from-ivory/20 to-transparent"></div>

	<p class="mb-5 text-sm text-silver">Prefer email?</p>

	<div class="flex flex-col gap-4">
		<a
			href={`mailto:${COMPANY_DATA.EMAIL}`}
			rel="external"
			class="group inline-flex items-center gap-2 text-sm font-semibold text-ivory transition-colors hover:text-accent-2"
		>
			<MailIcon class="h-4 w-4 text-accent-2" />
			{COMPANY_DATA.EMAIL}
			<ArrowRightIcon class="h-4 w-4 transition-transform group-hover:translate-x-1" />
		</a>
	</div>
</div>
