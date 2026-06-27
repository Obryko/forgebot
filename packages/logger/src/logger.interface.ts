export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

type LogFn = (message: string, context?: Partial<LogContext>) => void;

export interface Logger {
	debug: LogFn;
	info: LogFn;
	warn: LogFn;
	error: LogFn;

	child(context: Partial<LogContext>): Logger;
}
