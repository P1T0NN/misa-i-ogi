<script lang="ts">
	// COMPONENTS
	import HeroSection from '@/shared/components/pages/(unprotected)/root/hero-section.svelte';
	import BenefitsSection from '@/shared/components/pages/(unprotected)/root/benefits-section.svelte';
	import GuestFlowSection from '@/shared/components/pages/(unprotected)/root/guest-flow-section.svelte';
	import FeaturesSection from '@/shared/components/pages/(unprotected)/root/features-section/features-section.svelte';
	import StandardsSection from '@/shared/components/pages/(unprotected)/root/standards-section.svelte';
	import ClosingSection from '@/shared/components/pages/(unprotected)/root/closing-section.svelte';
	import ContactSection from '@/shared/components/ui/sections/contact-section/contact-section.svelte';
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
</script>

<SvelteHead
	title="Guest benefits for stays and hospitality venues"
	description="A premium QR benefits network for accommodations and hospitality venues. Guests scan in-room, discover curated local offers, and send reservation requests."
/>

<main id="content" class="bg-background text-foreground">
	<HeroSection />
	<BenefitsSection />
	<GuestFlowSection />
	<FeaturesSection />
	<StandardsSection />
	<ClosingSection />
	<ContactSection />
</main>
