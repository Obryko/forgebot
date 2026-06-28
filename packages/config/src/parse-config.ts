import { parse } from "yaml";
import { type ForgeBotConfig, forgeBotConfigSchema } from "./config.schema.ts";

export function parseConfig(source: string): ForgeBotConfig {
	const rawConfig = parse(source);

	return forgeBotConfigSchema.parse(rawConfig ?? {});
}
