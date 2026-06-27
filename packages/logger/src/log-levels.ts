import type {LogLevel} from "./logger.interface.ts";

export const logLevels: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

export function assertLogLevel(level: unknown): asserts level is LogLevel {
    const logLevelKeys = Object.keys(logLevels);
    if (typeof level !== "string" || !logLevelKeys.includes(level)) {
        throw new Error(`Invalid log level: ${level}`);
    }
}
