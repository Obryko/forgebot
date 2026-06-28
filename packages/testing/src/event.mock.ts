import type { ForgeBotEvent } from "@forgebot/core";

export function createMockForgeBotEvent(
	overrides: Partial<ForgeBotEvent> = {},
): ForgeBotEvent {
	return {
		provider: "github",
		name: "code_change.opened",
		repository: "test/repo",
		externalId: "1",
		payload: {},
		...overrides,
	};
}
