// SVELTEKIT IMPORTS
import { tick } from 'svelte';

// DATA
import { DEMO_TOTAL_STEPS, type DemoVenueKey } from '@/shared/data/demoData';

/** Public API for the interactive demo route; implemented by {@link createDemoPage}. */
export interface DemoPageModel {
	readonly currentStep: number;
	readonly currentVenue: DemoVenueKey;
	readonly redeemed: Partial<Record<DemoVenueKey, boolean>>;
	readonly scanBarPct: number;
	goTo: (step: number) => void;
	nextStep: () => void;
	prevStep: () => void;
	openDetail: (key: DemoVenueKey) => void;
	markRedeemed: () => void;
	mountKeyboard: () => () => void;
}

export const demoShell = 'mx-auto w-full max-w-(--container) px-5 sm:px-(--gutter)';

export function createDemoPage(): DemoPageModel {
	let currentStep = $state(1);
	let currentVenue = $state<DemoVenueKey>('skadarlija');
	let redeemed = $state<Partial<Record<DemoVenueKey, boolean>>>({});
	let scanBarPct = $state(0);
	let scanTimer: ReturnType<typeof setTimeout> | undefined;

	function clearScan() {
		if (scanTimer !== undefined) {
			clearTimeout(scanTimer);
			scanTimer = undefined;
		}
	}

	function goTo(step: number) {
		if (step < 1 || step > DEMO_TOTAL_STEPS) return;
		clearScan();
		currentStep = step;

		if (step === 2) {
			scanBarPct = 0;
			void tick().then(() => {
				requestAnimationFrame(() => {
					scanBarPct = 100;
				});
			});
			scanTimer = setTimeout(() => {
				scanTimer = undefined;
				if (currentStep === 2) goTo(3);
			}, 2200);
		}
	}

	function nextStep() {
		if (currentStep === DEMO_TOTAL_STEPS) goTo(1);
		else goTo(currentStep + 1);
	}

	function prevStep() {
		if (currentStep > 1) goTo(currentStep - 1);
	}

	function openDetail(key: DemoVenueKey) {
		currentVenue = key;
		goTo(5);
	}

	function markRedeemed() {
		redeemed = { ...redeemed, [currentVenue]: true };
		goTo(4);
	}

	function mountKeyboard() {
		const onKey = (e: KeyboardEvent) => {
			const t = e.target;
			if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) {
				return;
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextStep();
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevStep();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}

	return {
		get currentStep() {
			return currentStep;
		},
		get currentVenue() {
			return currentVenue;
		},
		get redeemed() {
			return redeemed;
		},
		get scanBarPct() {
			return scanBarPct;
		},
		goTo,
		nextStep,
		prevStep,
		openDetail,
		markRedeemed,
		mountKeyboard
	};
}
