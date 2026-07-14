import type { ForgeBotEventName, ForgeBotProvider } from "@forgebot/core";

export type ProcessCodeChangeJob = {
	type: "process_code_change";
	provider: ForgeBotProvider;
	eventName: ForgeBotEventName;
	repository: string;
	externalId: string;
	deliveryId?: string;
};

export type ForgeBotJob = ProcessCodeChangeJob;
