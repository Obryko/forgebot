export type GitHubWebhookEventName =
	| "pull_request"
	| "check_suite"
	| "check_run";

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
