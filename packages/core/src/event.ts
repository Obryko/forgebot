export type ForgeBotProvider = "github";

export type ForgeBotEventName =
	| "code_change.opened"
	| "code_change.updated"
	| "checks.completed";

export interface ForgeBotEvent {
	provider: ForgeBotProvider;
	name: ForgeBotEventName;
	repository: string;
	externalId: string;
	payload: unknown;
}
