<script lang="ts">
	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';

	let {
		phone,
		guestName,
		hospitalityName
	}: {
		phone: string;
		guestName: string;
		hospitalityName: string;
	} = $props();

	const whatsappPhone = $derived(phone.replace(/\D/g, ''));
	const whatsappMessage = $derived(
		encodeURIComponent(`Hello ${guestName}, your reservation at ${hospitalityName} is confirmed.`)
	);
	const whatsappHref = $derived(`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`);

	function contactViaWhatsApp() {
		window.open(whatsappHref, '_blank', 'noopener,noreferrer');
	}
</script>

<Button
	size="sm"
	class="w-full bg-green-600 text-white hover:bg-green-600/90 focus-visible:ring-green-600/20 sm:w-auto"
	disabled={!whatsappPhone}
	onclick={contactViaWhatsApp}
	aria-label={`Contact ${guestName} via WhatsApp`}
>
	<MessageCircleIcon data-icon="inline-start" />
	Contact via WhatsApp
</Button>
