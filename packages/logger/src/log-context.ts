import type { LogContext } from "./logger.interface.ts";

export function mergeLogContextWithSystemPriority(
	systemContext: LogContext,
	userContext: Partial<LogContext> = {},
): LogContext {
	return {
		...userContext,
		...systemContext,
	};
}
