import type { Snippet } from 'svelte';

export type { PaginatedListPayload, DataTableOptimizationStrategy } from '../data-table/types.js';

export type DataListItemSnippetProps<T> = {
	item: T;
};

export type DataListControlsPlace = 'top' | 'bottom';
