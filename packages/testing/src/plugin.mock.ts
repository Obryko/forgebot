import { mock } from "bun:test";
import type { ForgeBotPlugin } from "@forgebot/core";

export function createMockPlugin(
	overrides: Partial<ForgeBotPlugin> = {},
): ForgeBotPlugin {
	const name = overrides.name ?? "test-plugin";
	return {
		name,
		supports: mock(overrides.supports ?? (() => true)),
		run: mock(
			overrides.run ??
				(async () => ({
					pluginName: name,
					status: "success" as const,
				})),
		),
	};
}
