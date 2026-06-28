import { describe, expect, it } from "bun:test";
import { mergeLogContextWithSystemPriority } from "./log-context.ts";

describe("mergeLogContextWithSystemPriority", () => {
	it("should allow user context to add fields", () => {
		expect(
			mergeLogContextWithSystemPriority(
				{ plugin: "hello" },
				{ custom: "value" },
			),
		).toEqual({
			plugin: "hello",
			custom: "value",
		});
	});

	it("should not allow user context to override system context", () => {
		expect(
			mergeLogContextWithSystemPriority(
				{
					plugin: "hello",
					repository: "real/repo",
				},
				{
					plugin: "fake",
					repository: "fake/repo",
					custom: "value",
				},
			),
		).toEqual({
			plugin: "hello",
			repository: "real/repo",
			custom: "value",
		});
	});
});
