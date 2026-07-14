import {
	type ForgeBotConfig,
	loadConfig,
	resolveConfigPath,
} from "@forgebot/config";
import { runPlugins } from "@forgebot/core";
import createLogger, { type Logger } from "@forgebot/logger";
import { createPluginsFromConfig } from "./plugins/create-plugins-from-config.ts";
import { pluginRegistry } from "./plugins/plugin-registry.ts";
import {
	GitHubWebhookService,
	type IGitHubWebhookService,
} from "./services/github-webhook.service.ts";

const DEFAULT_CONFIG: ForgeBotConfig = {
	plugins: [
		{
			name: "hello",
			disabled: false,
			options: {},
		},
	],
};

const CONFIG_INPUT = {
	path: process.env.FORGEBOT_CONFIG_PATH,
	defaultPath: "forgebot.instance.yml",
};

async function loadInstanceConfig(logger: Logger): Promise<ForgeBotConfig> {
	const configPath = await resolveConfigPath(CONFIG_INPUT);
	try {
		logger.info(`Loading ForgeBot config from ${configPath}`);
		const config = await loadConfig(CONFIG_INPUT);
		logger.info(`Loaded ForgeBot config from ${configPath}`);
		return config;
	} catch (error) {
		if (error instanceof Error && error.name === "ConfigNotFoundError") {
			logger.warn(
				`ForgeBot config not found at ${configPath}, using default config`,
			);
			return DEFAULT_CONFIG;
		}
		const message = error instanceof Error ? error.message : String(error);
		logger.error(`Failed to load ForgeBot config: ${message}`);
		throw error;
	}
}

export default async function createDependencies() {
	const logger = createLogger({
		level: "debug",
		type: "console",
		output: console,
	});
	const config = await loadInstanceConfig(logger);

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

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
