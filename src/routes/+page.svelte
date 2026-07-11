<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import HeroSection from '@/shared/components/pages/(unprotected)/root/hero-section.svelte';
	import BenefitsSection from '@/shared/components/pages/(unprotected)/root/benefits-section.svelte';
	import GuestFlowSection from '@/shared/components/pages/(unprotected)/root/guest-flow-section.svelte';
	import FeaturesSection from '@/shared/components/pages/(unprotected)/root/features-section/features-section.svelte';
	import PricingSection from '@/shared/components/pages/(unprotected)/root/pricing-section/pricing-section.svelte';
	import StandardsSection from '@/shared/components/pages/(unprotected)/root/standards-section/standards-section.svelte';
	import FaqSection from '@/shared/components/pages/(unprotected)/root/faq-section/faq-section.svelte';
	import ContactSection from '@/shared/components/ui/sections/contact-section/contact-section.svelte';
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
</script>

<SvelteHead
	title={m['HomePage.SEO.title']()}
	description={m['HomePage.SEO.description']()}
/>

<main id="content" class="bg-background text-foreground">
	<HeroSection />
	<BenefitsSection />
	<GuestFlowSection />
	<FeaturesSection />
	<PricingSection />
	<StandardsSection />
	<FaqSection />
	<ContactSection />
</main>
