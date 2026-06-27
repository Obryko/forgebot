import { describe, expect, it, mock } from "bun:test";
import createApp from "../../src/app.ts";

describe.todo("/github/webhook", () => {
	const app = createApp({
		gitHubWebhookService: {
			handleWebhook: mock(),
		},
	});
	describe("(POST) /", () => {
		it("should return 200", async () => {
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
		});
	});
});
