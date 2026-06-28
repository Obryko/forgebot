import type { ForgeBotPlugin } from "@forgebot/core";

export type HelloPluginOptions = {
	message?: string;
};

export function createHelloPlugin(
	options: HelloPluginOptions = {},
): ForgeBotPlugin {
	const message = options.message ?? "Hello from ForgeBot plugin!";

	return {
		name: "hello",
		supports: () => true,
		run: async (context) => {
			context.logger.info(message);

			return {
				pluginName: "hello",
				status: "success",
				message,
			};
		},
	};
}
