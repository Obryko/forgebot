import { runPlugins } from "@forgebot/core";
import createLogger from "@forgebot/logger";
import { createPluginsFromConfig } from "./plugins/create-plugins-from-config.ts";
import { pluginRegistry } from "./plugins/plugin-registry.ts";
import {
	GitHubWebhookService,
	type IGitHubWebhookService,
} from "./services/github-webhook.service.ts";

export default function createDependencies() {
	const logger = createLogger({
		level: "debug",
		type: "console",
		output: console,
	});
	const config = {
		plugins: [
			{
				name: "hello",
				disabled: false,
				options: {},
			},
		],
	};

	const plugins = createPluginsFromConfig(config, pluginRegistry);

	const gitHubWebhookService: IGitHubWebhookService = new GitHubWebhookService(
		logger,
		plugins,
		runPlugins,
	);

	return {
		gitHubWebhookService,
	};
}

export type AppDependencies = ReturnType<typeof createDependencies>;
