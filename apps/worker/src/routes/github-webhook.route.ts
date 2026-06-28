import {Hono} from "hono";
import type {IGitHubWebhookService} from "../services/github-webhook.service.ts";

type GitHubWebhookRouteDependencies = {
    gitHubWebhookService: IGitHubWebhookService;
};

export default function createGitHubWebhookRoute(
    deps: GitHubWebhookRouteDependencies,
) {
    const gitHubWebhookRoute = new Hono();
    const {gitHubWebhookService} = deps;

    gitHubWebhookRoute.post("/", async (c) => {
        const eventName = c.req.header("x-github-event");
        const payload = await c.req.json().catch(() => undefined);

        const result = await gitHubWebhookService.handleWebhook({
            eventName,
            payload,
        });

        switch (result.status) {
            case "ignored":
                return c.body(null, 204);
            case "processed":
                return c.json({status: "processed"}, 202);
            case "invalid":
                return c.json({status: "invalid", message: result.message}, 400);
        }
    });

    return gitHubWebhookRoute;
}
