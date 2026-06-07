import { internalMutation } from '../_generated/server';
import { components } from '../_generated/api';
import { analytics } from '../analytics';

export const processPendingHighVolumeAnalyticsEvents = internalMutation({
	handler: async (ctx) => {
		await ctx.runMutation(components.analytics.lib.processPendingHighVolumeAnalyticsEvents, {
			config: analytics.config
		});
	}
});

export const purgeStaleAnalyticsEvents = internalMutation({
	handler: async (ctx) => {
		await ctx.runMutation(components.analytics.lib.purgeStaleAnalyticsEvents, {
			config: analytics.config
		});
	}
});
