import type { Logger } from "@forgebot/logger";
import type { ForgeBotEvent } from "./event.ts";

export interface ForgeBotContext {
	event: ForgeBotEvent;
	logger: Logger;
}
