import { readFile } from "node:fs/promises";
import { ConfigNotFoundError } from "./config.error.ts";
import type { ForgeBotConfig } from "./config.schema.ts";
import {
	type ResolveConfigPathInput,
	resolveConfigPath,
} from "./config-path.ts";
import { parseConfig } from "./parse-config.ts";

export type LoadConfigInput = ResolveConfigPathInput;

export async function loadConfig(
	input: LoadConfigInput = {},
): Promise<ForgeBotConfig> {
	const configPath = await resolveConfigPath(input);

	try {
		const source = await readFile(configPath, "utf8");

		return parseConfig(source);
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			throw new ConfigNotFoundError(configPath);
		}

		throw error;
	}
}
