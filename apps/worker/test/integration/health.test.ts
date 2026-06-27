import { describe, expect, it, mock } from "bun:test";
import createApp from "../../src/app.ts";

describe("/health", () => {
	const app = createApp({
		gitHubWebhookService: {
			handleWebhook: mock(),
		},
	});
	describe("(GET) /", () => {
		it("should return 200", async () => {
			const response = await app.request("/health");

			expect(response.status).toBe(200);
		});
	});
});
