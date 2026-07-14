import type { ForgeBotJob } from "./job.ts";

export type JobQueue = {
	enqueue(job: ForgeBotJob): Promise<void>;
};
