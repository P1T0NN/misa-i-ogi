<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { setLocale, getLocale, locales } from '@/shared/lib/paraglide/runtime';

	// COMPONENTS
	import { Select, SelectTrigger, SelectContent, SelectItem } from '@/shared/components/ui/select';

	// SVGS
	import UnitedKingdomFlag from '@/shared/svgs/united-kingdom-flag.svelte';
	import SerbiaFlag from '@/shared/svgs/serbia-flag.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils';

	type Locale = (typeof locales)[number];

	interface Props {
		variant?: 'default' | 'header';
	}

	let { variant = 'default' }: Props = $props();

	const languageOptions = [
		{
			locale: 'en' as const satisfies Locale,
			name: () => m['LanguageSelector.english'](),
			short: () => m['LanguageSelector.englishShort'](),
			Flag: UnitedKingdomFlag
		},
		{
			locale: 'sr' as const satisfies Locale,
			name: () => m['LanguageSelector.serbian'](),
			short: () => m['LanguageSelector.serbianShort'](),
			Flag: SerbiaFlag
		}
	] as const;

	const selectedLanguage = $derived.by(() => {
		void page.url.pathname;
		return getLocale();
	});

	const activeLanguage = $derived(
		languageOptions.find((option) => option.locale === selectedLanguage) ?? languageOptions[0]
	);

	function handleLanguageChange(languageCode: string) {
		if (!locales.includes(languageCode as Locale)) return;
		setLocale(languageCode as Locale);
	}
</script>

<Select type="single" value={selectedLanguage} onValueChange={handleLanguageChange}>
	<SelectTrigger
		aria-label={m['LanguageSelector.ariaLabel']()}
		class={cn(
			'flex w-auto items-center space-x-2',
			variant === 'header' &&
				'border-hero-overlay-foreground/20 bg-hero-overlay-foreground/10 hover:bg-hero-overlay-foreground/20'
		)}
	>
		<activeLanguage.Flag />

		<span
			class={cn(
				'font-dm-sans text-sm font-medium',
				variant === 'header' ? 'text-hero-overlay-foreground' : 'text-foreground'
			)}
		>
			{activeLanguage.short()}
		</span>
	</SelectTrigger>

	<SelectContent>
		{#each languageOptions as language (language.locale)}
			<SelectItem value={language.locale}>
				<div class="flex items-center space-x-3">
					<language.Flag />

					<div class="flex flex-col">
						<span class="font-dm-sans text-sm font-medium">
							{language.name()}
						</span>

						<span class="font-dm-sans text-xs text-muted-foreground">
							{language.short()}
						</span>
					</div>
				</div>
			</SelectItem>
		{/each}
	</SelectContent>
</Select>
