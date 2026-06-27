import { logLevels } from "./log-levels.ts";
import type { LogContext, Logger, LogLevel } from "./logger.interface.ts";

export interface ConsoleLike {
	debug(message: string): void;

	info(message: string): void;

	warn(message: string): void;

	error(message: string): void;
}

export class ConsoleLogger implements Logger {
	constructor(
		private readonly output: ConsoleLike,
		private readonly logLevel: LogLevel = "debug",
		private readonly context: LogContext = {},
	) {}

	debug(message: string, context?: Partial<LogContext>): void {
		this.log("debug", message, context);
	}

	error(message: string, context?: Partial<LogContext>): void {
		this.log("error", message, context);
	}

	info(message: string, context?: Partial<LogContext>): void {
		this.log("info", message, context);
	}

	warn(message: string, context?: Partial<LogContext>): void {
		this.log("warn", message, context);
	}

	child(context: Partial<LogContext>): Logger {
		return new ConsoleLogger(this.output, this.logLevel, {
			...this.context,
			...context,
		});
	}

	private log(
		level: LogLevel,
		message: string,
		context?: Partial<LogContext>,
	): void {
		if (logLevels[level] < logLevels[this.logLevel]) {
			return;
		}
		const logContext = { ...this.context, ...context };
		const logMessage = `[${level.toUpperCase()}] ${message} ${JSON.stringify(logContext)}`;
		this.output[level](logMessage);
	}
}
