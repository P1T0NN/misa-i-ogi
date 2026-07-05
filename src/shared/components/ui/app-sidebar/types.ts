// TYPES
import type { Component } from 'svelte';

export type AppSidebarNavChildItem = {
	name: string;
	url: string;
};

export type AppSidebarNavItem = {
	name: string;
	url?: string;
	icon: Component;
	groupLabel?: string;
	/** Match only on the exact path — for a link whose URL is a prefix of siblings (e.g. Analytics overview). */
	exact?: boolean;
	items?: AppSidebarNavChildItem[];
};

export type AppSidebarNavSecondaryItem = Omit<AppSidebarNavItem, 'url' | 'items'> & {
	url: string;
};

export type AppSidebarNavChildItemWithActive = AppSidebarNavChildItem & {
	isActive?: boolean;
};

export type AppSidebarNavItemWithActive = Omit<AppSidebarNavItem, 'items'> & {
	isActive?: boolean;
	items?: AppSidebarNavChildItemWithActive[];
};

export type AppSidebarNavSecondaryItemWithActive = AppSidebarNavSecondaryItem & {
	isActive?: boolean;
};

export type AppSidebarNavItems = {
	navMain: AppSidebarNavItem[];
	navSecondary?: AppSidebarNavSecondaryItem[];
};
