import { describe, expect, it } from "bun:test";
import type { ForgeBotContext } from "@forgebot/core";
import { createMockLogger } from "@forgebot/testing";
import { createHelloPlugin } from "./hello.plugin.ts";

describe("createHelloPlugin", () => {
	it("should create hello plugin", () => {
		const plugin = createHelloPlugin();

		expect(plugin.name).toBe("hello");
		expect(plugin.supports).toBeFunction();
		expect(plugin.run).toBeFunction();
	});

	it("should support every event", () => {
		const plugin = createHelloPlugin();

		expect(
			plugin.supports({
				provider: "github",
				name: "code_change.opened",
				repository: "test/repo",
				externalId: "1",
				payload: {},
			}),
		).toBeTruthy();
	});

	it("should log message and return success result", async () => {
		const logger = createMockLogger();
		const plugin = createHelloPlugin({
			message: "Custom hello",
		});

		const context: ForgeBotContext = {
			logger,
			event: {
				provider: "github",
				name: "code_change.opened",
				repository: "test/repo",
				externalId: "1",
				payload: {},
			},
		};
		const result = await plugin.run(context);

		expect(result).toEqual({
			pluginName: "hello",
			status: "success",
			message: "Custom hello",
		});

		expect(logger.info).toHaveBeenCalled();
	});
});
