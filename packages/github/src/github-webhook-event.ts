export type GitHubWebhookEventName =
	| "pull_request"
	| "check_suite"
	| "check_run"
	| string;

export type GitHubPullRequestAction = "opened" | "synchronize";

export type GitHubWebhookPayload = {
	action?: string;
	repository?: {
		full_name?: string;
	};
	pull_request?: {
		number?: number;
		id?: number;
	};
	check_suite?: {
		id?: number;
	};
	check_run?: {
		id?: number;
	};
};

export function isGitHubWebhookEventName(
	value: string,
): value is GitHubWebhookEventName {
	return (
		value === "pull_request" || value === "check_suite" || value === "check_run"
	);
}
