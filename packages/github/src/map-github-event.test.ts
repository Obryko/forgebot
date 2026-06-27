import { describe, expect, it } from "bun:test";
import type { GitHubWebhookEventName } from "./github-webhook-event.ts";
import { mapGitHubEvent } from "./map-github-event.ts";

describe("map github event", () => {
	it("should return null when repository not exist", () => {
		expect(mapGitHubEvent("pull_request", {})).toBeNull();
	});

	it("should return null when event name is not supported", () => {
		expect(
			mapGitHubEvent("unknown" as GitHubWebhookEventName, {
				repository: { full_name: "test/repo" },
			}),
		).toBeNull();
	});

	describe("pull_request", () => {
		it("should return null when pull request number not exist", () => {
			expect(
				mapGitHubEvent("pull_request", {
					repository: { full_name: "test/repo" },
				}),
			).toBeNull();
		});

		it("should return null when action is not supported", () => {
			expect(
				mapGitHubEvent("pull_request", {
					action: "unknown",
					pull_request: { number: 1 },
					repository: { full_name: "test/repo" },
				}),
			).toBeNull();
		});

		it("should return code_change.open event", () => {
			const payload = {
				action: "opened",
				pull_request: { number: 1 },
				repository: { full_name: "test/repo" },
			};
			const result = mapGitHubEvent("pull_request", payload);
			expect(result).toEqual({
				provider: "github",
				name: "code_change.opened",
				repository: "test/repo",
				externalId: "1",
				payload,
			});
		});
		it("should return code_change.updated event", () => {
			const payload = {
				action: "synchronize",
				pull_request: { number: 1 },
				repository: { full_name: "test/repo" },
			};
			const result = mapGitHubEvent("pull_request", payload);
			expect(result).toEqual({
				provider: "github",
				name: "code_change.updated",
				repository: "test/repo",
				externalId: "1",
				payload,
			});
		});
	});
	describe("check_suite", () => {
		it("should return null when check suite id not exist", () => {
			expect(
				mapGitHubEvent("check_suite", {
					repository: { full_name: "test/repo" },
				}),
			).toBeNull();
		});

		it("should return null when action is not supported", () => {
			expect(
				mapGitHubEvent("check_suite", {
					action: "unknown",
					check_suite: { id: 1 },
					repository: { full_name: "test/repo" },
				}),
			).toBeNull();
		});

		it("should return checks.completed event", () => {
			const payload = {
				action: "completed",
				check_suite: { id: 1 },
				repository: { full_name: "test/repo" },
			};
			const result = mapGitHubEvent("check_suite", payload);
			expect(result).toEqual({
				provider: "github",
				name: "checks.completed",
				repository: "test/repo",
				externalId: "1",
				payload,
			});
		});
	});
	describe("check_run", () => {
		it("should return null when check run id not exist", () => {
			expect(
				mapGitHubEvent("check_run", {
					repository: { full_name: "test/repo" },
				}),
			).toBeNull();
		});

		it("should return null when action is not supported", () => {
			expect(
				mapGitHubEvent("check_run", {
					action: "unknown",
					check_run: { id: 1 },
					repository: { full_name: "test/repo" },
				}),
			).toBeNull();
		});

		it("should return checks.completed event", () => {
			const payload = {
				action: "completed",
				check_run: { id: 1 },
				repository: { full_name: "test/repo" },
			};
			const result = mapGitHubEvent("check_run", payload);
			expect(result).toEqual({
				provider: "github",
				name: "checks.completed",
				repository: "test/repo",
				externalId: "1",
				payload,
			});
		});
	});
});
