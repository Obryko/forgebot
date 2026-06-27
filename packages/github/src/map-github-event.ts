import type { ForgeBotEvent } from "@forgebot/core";
import type {
	GitHubWebhookEventName,
	GitHubWebhookPayload,
} from "./github-webhook-event.ts";

const provider = "github" as const;

export function mapGitHubEvent(
	eventName: GitHubWebhookEventName,
	payload: GitHubWebhookPayload,
): ForgeBotEvent | null {
	const repository = payload.repository?.full_name;

	if (!repository) {
		return null;
	}

	switch (eventName) {
		case "pull_request": {
			if (!payload.pull_request?.number) {
				return null;
			}
			const externalId = String(payload.pull_request.number);
			if (payload.action === "opened") {
				return {
					provider,
					name: "code_change.opened",
					repository,
					externalId,
					payload,
				};
			}

			if (payload.action === "synchronize") {
				return {
					provider,
					name: "code_change.updated",
					repository,
					externalId,
					payload,
				};
			}

			return null;
		}

		case "check_suite": {
			if (!payload.check_suite?.id) {
				return null;
			}
			const externalId = String(payload.check_suite.id);

			if (payload.action === "completed") {
				return {
					provider,
					name: "checks.completed",
					repository,
					externalId,
					payload,
				};
			}

			return null;
		}

		case "check_run": {
			if (!payload.check_run?.id) {
				return null;
			}
			const externalId = String(payload.check_run.id);

			if (payload.action === "completed") {
				return {
					provider,
					name: "checks.completed",
					repository,
					externalId,
					payload,
				};
			}

			return null;
		}

		default:
			return null;
	}
}
