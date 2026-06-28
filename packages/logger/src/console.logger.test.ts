import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ConsoleLike, ConsoleLogger } from "./console.logger.ts";
import type { LogContext, LogLevel } from "./logger.interface.ts";

describe("Console Logger", () => {
	const consoleLike: ConsoleLike = {
		debug: mock(),
		info: mock(),
		warn: mock(),
		error: mock(),
	};

	beforeEach(() => {
		mock.clearAllMocks();
	});

	const context: LogContext = {
		repository: "test-repository",
	};
	describe("context merging", () => {
		it("should not allow log context to override logger context", () => {
			const output = {
				debug: mock(),
				info: mock(),
				warn: mock(),
				error: mock(),
			};

			const logger = new ConsoleLogger(output, "debug", {
				plugin: "hello",
				repository: "real/repo",
			});

			logger.info("message", {
				plugin: "fake",
				repository: "fake/repo",
				custom: "value",
			});

			expect(output.info).toHaveBeenCalledWith(
				'[INFO] message {"plugin":"hello","repository":"real/repo","custom":"value"}',
			);
		});
	});
	describe("with log level debug", () => {
		const logger = new ConsoleLogger(consoleLike, "debug", context);
		it.each([
			"debug",
			"info",
			"warn",
			"error",
		])("should log %s messages", (level: LogLevel) => {
			logger[level]("Test message");
			expect(consoleLike[level]).toHaveBeenCalledWith(
				`[${level.toUpperCase()}] Test message ${JSON.stringify(context)}`,
			);
		});
	});

	describe("with log level info", () => {
		const logger = new ConsoleLogger(consoleLike, "info", context);
		it.each([
			"info",
			"warn",
			"error",
		])("should log %s messages", (level: LogLevel) => {
			logger[level]("Test message");
			expect(consoleLike[level]).toHaveBeenCalledWith(
				`[${level.toUpperCase()}] Test message ${JSON.stringify(context)}`,
			);
		});
		it("should not log debug messages", () => {
			logger.debug("Test message");
			expect(consoleLike.debug).not.toHaveBeenCalled();
		});
	});
	describe("with log level warn", () => {
		const logger = new ConsoleLogger(consoleLike, "warn", context);
		it.each(["warn", "error"])("should log %s messages", (level: LogLevel) => {
			logger[level]("Test message");
			expect(consoleLike[level]).toHaveBeenCalledWith(
				`[${level.toUpperCase()}] Test message ${JSON.stringify(context)}`,
			);
		});
		it.each([
			"debug",
			"info",
		])("should not log %s messages", (level: LogLevel) => {
			logger[level]("Test message");
			expect(consoleLike[level]).not.toHaveBeenCalled();
		});
	});
	describe("with log level error", () => {
		const logger = new ConsoleLogger(consoleLike, "error", context);
		it.each(["error"])("should log %s messages", (level: LogLevel) => {
			logger[level]("Test message");
			expect(consoleLike[level]).toHaveBeenCalledWith(
				`[${level.toUpperCase()}] Test message ${JSON.stringify(context)}`,
			);
		});
		it.each([
			"debug",
			"info",
			"warn",
		])("should not log %s messages", (level: LogLevel) => {
			logger[level]("Test message");
			expect(consoleLike[level]).not.toHaveBeenCalled();
		});
	});

	describe("child logger", () => {
		it("should not allow child context to override parent context", () => {
			const output = {
				debug: mock(),
				info: mock(),
				warn: mock(),
				error: mock(),
			};

			const logger = new ConsoleLogger(output, "debug", {
				plugin: "hello",
			});

			const child = logger.child({
				plugin: "fake",
				custom: "value",
			});

			child.info("message");

			expect(output.info).toHaveBeenCalledWith(
				'[INFO] message {"plugin":"hello","custom":"value"}',
			);
		});
	});
});
