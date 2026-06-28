import { describe, expect, it } from "bun:test";
import { parseConfig } from "./parse-config.ts";

describe("parseConfig", () => {
	it("should parse empty config", () => {
		expect(parseConfig("")).toStrictEqual({
			plugins: [],
		});
	});

	it("should parse config with plugins", () => {
		expect(
			parseConfig(`
        plugins:
          - name: plugin1
          - name: plugin2
        `),
		).toStrictEqual({
			plugins: [
				{
					name: "plugin1",
					disabled: false,
					options: {},
				},
				{
					name: "plugin2",
					disabled: false,
					options: {},
				},
			],
		});
	});

	it("should parse disabled plugins", () => {
		expect(
			parseConfig(`
        plugins:
         - name: plugin1
           disabled: true
         - name: plugin2
           disabled: true
        `),
		).toStrictEqual({
			plugins: [
				{
					name: "plugin1",
					disabled: true,
					options: {},
				},
				{
					name: "plugin2",
					disabled: true,
					options: {},
				},
			],
		});
	});

	it("should parse plugins with options", () => {
		expect(
			parseConfig(`
        plugins:
            - name: plugin1
              options:
                key1: value1
                
            - name: plugin2
              options:
                key2: value2
        `),
		).toStrictEqual({
			plugins: [
				{
					name: "plugin1",
					disabled: false,
					options: {
						key1: "value1",
					},
				},
				{
					name: "plugin2",
					disabled: false,
					options: {
						key2: "value2",
					},
				},
			],
		});
	});

	it("should reject with invalid root property", () => {
		expect(() =>
			parseConfig(`
        invalid: true
        `),
		).toThrow();
	});

	it("should reject unknown plugin properties", () => {
		expect(() =>
			parseConfig(`
        plugins:
            - name: plugin1
              invalid: true
        `),
		).toThrow();
	});
});
