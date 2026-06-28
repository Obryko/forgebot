import type { ForgeBotConfig } from "@forgebot/config";
import type { ForgeBotPlugin } from "@forgebot/core";
import type { PluginFactory } from "./plugin-registry.ts";

export function createPluginsFromConfig(
	config: ForgeBotConfig,
	registry: PluginFactory[],
): ForgeBotPlugin[] {
	return config.plugins
		.filter((pluginConfig) => !pluginConfig.disabled)
		.map((pluginConfig) => {
			const factory = registry.find(
				(pluginFactory) => pluginFactory.name === pluginConfig.name,
			);

			if (!factory) {
				throw new Error(`Unknown plugin configured: ${pluginConfig.name}`);
			}

			return factory.create(pluginConfig.options);
		});
}
