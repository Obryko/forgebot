import { Hono } from "hono";
import type { AppDependencies } from "./dependencies.ts";
import createGitHubWebhookRoute from "./routes/github-webhook.route.ts";
import createHealthRoute from "./routes/health.route.ts";

export default function createApp(deps: AppDependencies) {
	const app = new Hono();

	app.route("/health", createHealthRoute());

	app.route("/webhooks/github", createGitHubWebhookRoute(deps));

	return app;
}
