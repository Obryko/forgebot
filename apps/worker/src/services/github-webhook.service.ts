import type { ForgeBotPlugin, RunPluginsFn } from "@forgebot/core";
import {
	type GitHubWebhookPayload,
	isGitHubWebhookEventName,
	mapGitHubEvent,
} from "@forgebot/github";
import type { Logger } from "@forgebot/logger";

export type GitHubWebhookInput = {
	eventName: string | undefined;
	payload: unknown;
};

export type GitHubWebhookResult =
	| { status: "ignored" }
	| { status: "processed" }
	| { status: "invalid"; message: string };

export interface IGitHubWebhookService {
	handleWebhook(input: GitHubWebhookInput): Promise<GitHubWebhookResult>;
}

export class GitHubWebhookService implements IGitHubWebhookService {
	constructor(
		private readonly logger: Logger,
		private readonly plugins: ForgeBotPlugin[],
		private readonly runPlugins: RunPluginsFn,
	) {
		this.logger = logger.child({
			service: "github-webhook",
		});
	}

	async handleWebhook(input: GitHubWebhookInput): Promise<GitHubWebhookResult> {
		if (!input.eventName) {
			this.logger.warn("Invalid GitHub webhook input, missing event name");
			return {
				status: "invalid",
				message: "Invalid input. Missing event name.",
			};
		}
		if (!isGitHubWebhookEventName(input.eventName)) {
			this.logger.info("Unsupported GitHub webhook event ignored");
			return {
				status: "ignored",
			};
		}
		if (!(input.payload && typeof input.payload === "object")) {
			this.logger.warn("Invalid GitHub webhook input, missing payload");
			return {
				status: "invalid",
				message: "Invalid input. Missing payload.",
			};
		}
		this.logger.info(`Received GitHub webhook: ${input.eventName}`);
		const event = mapGitHubEvent(
			input.eventName,
			input.payload as GitHubWebhookPayload,
		);

		if (!event) {
			this.logger.info("Unsupported GitHub webhook event ignored");
			return {
				status: "ignored",
			};
		}
		await this.runPlugins(this.plugins, {
			event,
			logger: this.logger,
		});
		return {
			status: "processed",
		};
	}
}
