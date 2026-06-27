import {type ConsoleLike, ConsoleLogger} from "./console.logger.ts";
import {assertLogLevel} from "./log-levels.ts";
import type {LogContext, Logger, LogLevel} from "./logger.interface.ts";

export type LoggerConfig = {
    level: LogLevel | Uppercase<LogLevel>;
    type: "console";
    output: ConsoleLike;
};

export const createLogger = (
    config: LoggerConfig,
    context?: LogContext,
): Logger => {
    const level = config.level.toLowerCase();
    assertLogLevel(level);
    switch (config.type) {
        case "console": {
            return new ConsoleLogger(config.output, level, context);
        }
        default:
            throw new Error(`Unsupported logger type: ${config.type}`);
    }
};
