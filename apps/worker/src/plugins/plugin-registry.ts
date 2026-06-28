import type { ForgeBotPlugin } from "@forgebot/core";
import { createHelloPlugin } from "@forgebot/plugin-hello";

export type PluginFactory = {
	name: string;
	create: (options: Record<string, unknown>) => ForgeBotPlugin;
};

export const pluginRegistry: PluginFactory[] = [
	{
		name: "hello",
		create: (options) =>
			createHelloPlugin({
				message:
					typeof options.message === "string" ? options.message : undefined,
			}),
	},
];
