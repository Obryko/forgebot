import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { Logger } from "@forgebot/logger";
import {
	createMockForgeBotEvent,
	createMockLogger,
	createMockPlugin,
} from "@forgebot/testing";
import { runPlugins } from "./plugin-runner.ts";

describe("plugin runner", () => {
	const logger: Logger = createMockLogger();

	beforeEach(() => {
		mock.clearAllMocks();
	});

	const event = createMockForgeBotEvent();

	it("should run plugin", async () => {
		const plugin = createMockPlugin({
			name: "first",
			run: () =>
				Promise.resolve({
					pluginName: "first",
					status: "success",
					message: "Plugin executed successfully",
				}),
		});

		const results = await runPlugins([plugin], {
			event,
			logger,
		});

		expect(results).toHaveLength(1);
		expect(results[0]).toEqual({
			pluginName: "first",
			status: "success",
			message: "Plugin executed successfully",
		});
	});

	it("should skip unsupported plugins", async () => {
		const plugin = createMockPlugin({
			name: "first",
			supports: () => false,
			run: () =>
				Promise.resolve({
					pluginName: "first",
					status: "success",
				}),
		});
		const results = await runPlugins([plugin], {
			event,
			logger,
		});
		expect(results).toHaveLength(0);
	});

	it("should return failed plugin result", async () => {
		const plugin = createMockPlugin({
			name: "first",
			run: () => Promise.reject(new Error("Plugin failed")),
		});
		const results = await runPlugins([plugin], {
			event,
			logger,
		});
		expect(results).toHaveLength(1);
		expect(results[0]).toEqual({
			pluginName: "first",
			status: "failed",
			message: "Plugin failed",
		});
	});

	it("should run multiple plugins in order", async () => {
		const plugin1 = createMockPlugin({
			name: "first",
			run: () =>
				Promise.resolve({
					pluginName: "first",
					status: "success",
				}),
		});
		const plugin2 = createMockPlugin({
			name: "second",
			supports: () => false,
			run: () =>
				Promise.resolve({
					pluginName: "second",
					status: "success",
				}),
		});
		const plugin3 = createMockPlugin({
			name: "third",
			run: () => Promise.reject(new Error("Plugin failed")),
		});
		const plugin4 = createMockPlugin({
			name: "fourth",
			run: () =>
				Promise.resolve({
					pluginName: "fourth",
					status: "success",
				}),
		});
		const results = await runPlugins([plugin1, plugin2, plugin3, plugin4], {
			event,
			logger,
		});
		expect(results).toHaveLength(3);
		expect(results[0]).toEqual({
			pluginName: "first",
			status: "success",
		});
		expect(results[1]).toEqual({
			pluginName: "third",
			status: "failed",
			message: "Plugin failed",
		});
		expect(results[2]).toEqual({
			pluginName: "fourth",
			status: "success",
		});
	});
});
