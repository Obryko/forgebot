import { beforeEach, describe, expect, it, mock } from "bun:test";
import { runPlugins } from "@forgebot/core";
import { createMockLogger, createMockPlugin } from "@forgebot/testing";
import createApp from "../../src/app.ts";
import { GitHubWebhookService } from "../../src/services/github-webhook.service.ts";

describe("/github/webhook", () => {
	const logger = createMockLogger();
	const plugin = createMockPlugin({
		supports: mock((event) => event.name === "code_change.opened"),
	});

	const gitHubWebhookService = new GitHubWebhookService(
		logger,
		[plugin],
		runPlugins,
	);
	const app = createApp({
		gitHubWebhookService,
	});
	beforeEach(() => {
		mock.clearAllMocks();
	});

	describe("(POST) /", () => {
		it("should return 202 and run matching plugin for valid pull_request opened webhook", async () => {
			const response = await app.request("/webhooks/github", {
				method: "POST",
				headers: {
					"x-github-event": "pull_request",
					"content-type": "application/json",
				},
				body: JSON.stringify({
					action: "opened",
					pull_request: { number: 1 },
					repository: { full_name: "test/repo" },
				}),
			});

			expect(response.status).toBe(202);
			expect(plugin.supports).toHaveBeenCalledWith(
				expect.objectContaining({
					provider: "github",
					name: "code_change.opened",
					repository: "test/repo",
					externalId: "1",
				}),
			);
			expect(plugin.run).toHaveBeenCalledWith(
				expect.objectContaining({
					event: expect.objectContaining({
						provider: "github",
						name: "code_change.opened",
						repository: "test/repo",
						externalId: "1",
					}),
					logger,
				}),
			);
		});
		it("should return 204 when event name is not supported", async () => {
			const response = await app.request("/webhooks/github", {
				method: "POST",
				headers: {
					"x-github-event": "pull",
					"content-type": "application/json",
				},
				body: JSON.stringify({
					action: "opened",
					pull_request: { number: 1 },
					repository: { full_name: "test/repo" },
				}),
			});

			expect(response.status).toBe(204);
			expect(response.body).toBeNull();

			expect(plugin.supports).not.toHaveBeenCalled();
			expect(plugin.run).not.toHaveBeenCalled();
		});
		it("should return 400 when event name is not exist", async () => {
			const response = await app.request("/webhooks/github", {
				method: "POST",
			});

			expect(response.status).toEqual(400);
			const body = await response.json();

			expect(body).toEqual({
				status: "invalid",
				message: "Invalid input. Missing event name.",
			});
		});
	});
});
