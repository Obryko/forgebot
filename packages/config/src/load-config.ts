import { readFile } from "node:fs/promises";
import type { ForgeBotConfig } from "./config.schema.ts";
import { ConfigNotFoundError } from "./config-not-found.error.ts";
import { parseConfig } from "./parse-config.ts";

export type LoadConfigInput = {
	path: string;
};

export async function loadConfig(
	input: LoadConfigInput,
): Promise<ForgeBotConfig> {
	try {
		const source = await readFile(input.path, "utf8");
		return parseConfig(source);
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			throw new ConfigNotFoundError(input.path);
		}
		throw error;
	}
}
