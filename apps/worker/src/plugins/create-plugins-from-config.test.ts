import { describe, expect, it, mock } from "bun:test";
import { createMockPlugin } from "@forgebot/testing";
import { createPluginsFromConfig } from "./create-plugins-from-config.ts";
import type { PluginFactory } from "./plugin-registry.ts";

describe("createPluginsFromConfig", () => {
	it("should create enabled plugins", () => {
		const plugin = createMockPlugin({ name: "hello" });
		const create = mock(() => plugin);

		const registry: PluginFactory[] = [
			{
				name: "hello",
				create,
			},
		];

		const plugins = createPluginsFromConfig(
			{
				plugins: [
					{
						name: "hello",
						disabled: false,
						options: {},
					},
				],
			},
			registry,
		);

		expect(plugins).toEqual([plugin]);
		expect(create).toHaveBeenCalledWith({});
	});

	it("should skip disabled plugins", () => {
		const create = mock(() => createMockPlugin());

		const plugins = createPluginsFromConfig(
			{
				plugins: [
					{
						name: "hello",
						disabled: true,
						options: {},
					},
				],
			},
			[
				{
					name: "hello",
					create,
				},
			],
		);

		expect(plugins).toEqual([]);
		expect(create).not.toHaveBeenCalled();
	});

	it("should pass plugin options to factory", () => {
		const plugin = createMockPlugin({ name: "hello" });
		const create = mock(() => plugin);

		createPluginsFromConfig(
			{
				plugins: [
					{
						name: "hello",
						disabled: false,
						options: {
							message: "Custom message",
						},
					},
				],
			},
			[
				{
					name: "hello",
					create,
				},
			],
		);

		expect(create).toHaveBeenCalledWith({
			message: "Custom message",
		});
	});

	it("should throw for unknown plugin", () => {
		expect(() =>
			createPluginsFromConfig(
				{
					plugins: [
						{
							name: "unknown",
							disabled: false,
							options: {},
						},
					],
				},
				[],
			),
		).toThrow("Unknown plugin configured: unknown");
	});
});
