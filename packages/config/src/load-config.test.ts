import { describe, expect, it } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ConfigNotFoundError } from "./config-not-found.error.ts";
import { loadConfig } from "./load-config.ts";

describe("loadConfig", () => {
	it("should load config from file", async () => {
		const directory = await mkdtemp(join(tmpdir(), "forgebot-config-"));
		const path = join(directory, "forgebot.yml");

		try {
			await writeFile(
				path,
				`
plugins:
  - name: hello
`,
				"utf8",
			);

			const config = await loadConfig({ path });
			expect(config).toEqual({
				plugins: [
					{
						name: "hello",
						disabled: false,
						options: {},
					},
				],
			});
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});
	it("should reject when config file does not exist", async () => {
		try {
			await loadConfig({ path: "/tmp/forgebot-config-does-not-exist.yml" });
			throw new Error("Expected ConfigNotFoundError");
		} catch (error) {
			expect(error).toBeInstanceOf(ConfigNotFoundError);
		}
	});
});
