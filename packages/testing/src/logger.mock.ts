import { mock } from "bun:test";
import type { Logger } from "@forgebot/logger";

export function createMockLogger(): Logger {
	const logger: Logger = {
		debug: mock(),
		info: mock(),
		warn: mock(),
		error: mock(),
		child: mock(function (this: Logger) {
			return this;
		}),
	};

	return logger;
}
