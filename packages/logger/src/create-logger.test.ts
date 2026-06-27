import { describe, expect, it } from "bun:test";
import { ConsoleLogger } from "./console.logger.ts";
import { createLogger, type LoggerConfig } from "./create-logger.ts";

describe("create logger", () => {
	it("should create console logger", () => {
		const logger = createLogger({
			level: "debug",
			type: "console",
			output: console,
		});
		expect(logger).toBeDefined();
		expect(logger).toBeInstanceOf(ConsoleLogger);
	});

	it("should throw error if type is not supported", () => {
		expect(() => {
			createLogger({
				level: "debug",
				type: "uknown",
			} as unknown as LoggerConfig);
		}).toThrowError("Unsupported logger type: uknown");
	});
});
