import { z } from "zod";

export const pluginConfigSchema = z
	.object({
		name: z.string().min(1, { message: "Plugin name is required" }),
		disabled: z.boolean().default(false),
		options: z.record(z.string(), z.unknown()).default({}),
	})
	.strict();

export const forgeBotConfigSchema = z
	.object({
		plugins: z.array(pluginConfigSchema).default([]),
	})
	.strict();

export type PluginConfig = z.infer<typeof pluginConfigSchema>;
export type ForgeBotConfig = z.infer<typeof forgeBotConfigSchema>;
