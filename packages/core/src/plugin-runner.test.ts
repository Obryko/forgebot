import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { Logger } from "@forgebot/logger";
import type { ForgeBotEvent } from "./event.ts";
import type { ForgeBotPlugin } from "./plugin.ts";
import { runPlugins } from "./plugin-runner.ts";
import type { PluginResult } from "./result.ts";

type CreatePluginFn = (options: {
	name: string;
	supports: boolean;
	run: () => Promise<PluginResult>;
}) => ForgeBotPlugin;

const createPlugin: CreatePluginFn = ({ name, supports, run }) => ({
	name,
	supports: () => supports,
	run,
});

describe("plugin runner", () => {
	const logger: Logger = {
		debug: mock(),
		info: mock(),
		warn: mock(),
		error: mock(),
		child: mock(),
	};

	beforeEach(() => {
		mock.clearAllMocks();
	});

	const event: ForgeBotEvent = {
		provider: "github",
		name: "code_change.opened",
		repository: "test-repo",
		externalId: "123",
		payload: {},
	};

	it("should run plugin", async () => {
		const plugin = createPlugin({
			name: "first",
			supports: true,
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
		const plugin = createPlugin({
			name: "first",
			supports: false,
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
		const plugin = createPlugin({
			name: "first",
			supports: true,
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
		const plugin1 = createPlugin({
			name: "first",
			supports: true,
			run: () =>
				Promise.resolve({
					pluginName: "first",
					status: "success",
				}),
		});
		const plugin2 = createPlugin({
			name: "second",
			supports: false,
			run: () =>
				Promise.resolve({
					pluginName: "second",
					status: "success",
				}),
		});
		const plugin3 = createPlugin({
			name: "third",
			supports: true,
			run: () => Promise.reject(new Error("Plugin failed")),
		});
		const plugin4 = createPlugin({
			name: "fourth",
			supports: true,
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
