<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

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
		encodeURIComponent(
			m['ReservationsPage.ContactViaWhatsappButton.message']({ guestName, hospitalityName })
		)
	);
	const whatsappHref = $derived(`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`);
</script>

<Button
	size="sm"
	class="w-full bg-green-600 text-white hover:bg-green-600/90 focus-visible:ring-green-600/20 sm:w-auto"
	disabled={!whatsappPhone}
	onclick={() => window.open(whatsappHref, '_blank', 'noopener,noreferrer')}
	aria-label={m['ReservationsPage.ContactViaWhatsappButton.ariaLabel']({ guestName })}
>
	<MessageCircleIcon data-icon="inline-start" />
	{m['ReservationsPage.ContactViaWhatsappButton.label']()}
</Button>
