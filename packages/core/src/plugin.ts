import type { ForgeBotContext } from "./context.ts";
import type { ForgeBotEvent } from "./event.ts";
import type { PluginResult } from "./result.ts";

export interface ForgeBotPlugin {
	name: string;

	supports(event: ForgeBotEvent): boolean;

	run(context: ForgeBotContext): Promise<PluginResult>;
}
