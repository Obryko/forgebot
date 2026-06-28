import {beforeEach, describe, expect, it, mock} from "bun:test";
import type {Logger} from "@forgebot/logger";
import {type GitHubWebhookInput, GitHubWebhookService,} from "./github-webhook.service.ts";

describe("Github Webhook Service", () => {
    const logger: Logger = {
        debug: mock(),
        info: mock(),
        warn: mock(),
        error: mock(),
        child: mock(() => logger),
    };

    const runPlugins = mock();

    const service = new GitHubWebhookService(logger, [], runPlugins);

    beforeEach(() => {
        mock.clearAllMocks();
    });

    it("should create an instance of GitHubWebhookService", () => {
        const service = new GitHubWebhookService(logger, [], runPlugins);
        expect(service).toBeInstanceOf(GitHubWebhookService);
        expect(logger.child).toHaveBeenCalledWith({
            service: "github-webhook",
        });
    });

    describe("handleWebhook", () => {
        it("should return invalid when event name is not exist", async () => {
            const input: GitHubWebhookInput = {
                eventName: undefined,
                payload: {},
            };

            const result = await service.handleWebhook(input);

            expect(result).toEqual({
                status: "invalid",
                message: "Invalid input. Missing event name.",
            });
            expect(logger.warn).toHaveBeenCalledWith(
                "Invalid GitHub webhook input, missing event name",
            );
        });

        it("should return ignored when event name is not supported", async () => {
            const input: GitHubWebhookInput = {
                eventName: "pull",
                payload: {},
            };
            const result = await service.handleWebhook(input);
            expect(result).toEqual({
                status: "ignored",
            });
            expect(logger.info).toHaveBeenCalledWith(
                "Unsupported GitHub webhook event ignored",
            );
        });

        it("should return invalid when payload is not exist", async () => {
            const input: GitHubWebhookInput = {
                eventName: "pull_request",
                payload: undefined,
            };
            const result = await service.handleWebhook(input);

            expect(result).toEqual({
                status: "invalid",
                message: "Invalid input. Missing payload.",
            });
            expect(logger.warn).toHaveBeenCalledWith(
                "Invalid GitHub webhook input, missing payload",
            );
        });

        it("should return invalid when payload is not an object", async () => {
            const input: GitHubWebhookInput = {
                eventName: "pull_request",
                payload: "not an object",
            };
            const result = await service.handleWebhook(input);

            expect(result).toEqual({
                status: "invalid",
                message: "Invalid input. Missing payload.",
            });
            expect(logger.warn).toHaveBeenCalledWith(
                "Invalid GitHub webhook input, missing payload",
            );
        });

        it("should return processed when event name and payload are valid", async () => {
            const input: GitHubWebhookInput = {
                eventName: "pull_request",
                payload: {
                    action: "opened",
                    repository: {
                        full_name: "test/repo",
                    },
                    pull_request: {
                        number: 1,
                    },
                },
            };
            const result = await service.handleWebhook(input);

            expect(result).toEqual({
                status: "processed",
            });
            expect(runPlugins).toHaveBeenCalledWith([], {
                event: expect.objectContaining({
                    provider: "github",
                    name: "code_change.opened",
                    repository: "test/repo",
                    externalId: "1",
                }),
                logger,
            });
            expect(logger.info).toHaveBeenCalledWith(
                "Received GitHub webhook: pull_request",
            );
        });
    });
});
