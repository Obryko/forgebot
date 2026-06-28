import { type ForgeBotPlugin, runPlugins } from "@forgebot/core";
import createLogger from "@forgebot/logger";
import { createHelloPlugin } from "@forgebot/plugin-hello";
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

	const plugins: ForgeBotPlugin[] = [createHelloPlugin()];

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
