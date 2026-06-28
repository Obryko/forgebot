import type { ForgeBotContext } from "./context.ts";
import type { ForgeBotPlugin } from "./plugin.ts";
import type { PluginResult } from "./result.ts";

export async function runPlugins(
	plugins: ForgeBotPlugin[],
	context: ForgeBotContext,
): Promise<PluginResult[]> {
	const results: PluginResult[] = [];
	const logger = context.logger.child({
		event: context.event.name,
		repository: context.event.repository,
		externalId: context.event.externalId,
	});
	for (const plugin of plugins) {
		if (!plugin.supports(context.event)) {
			continue;
		}
		const pluginLogger = logger.child({
			plugin: plugin.name,
		});
		try {
			const result = await plugin.run({ ...context, logger: pluginLogger });
			pluginLogger.info(
				`Plugin executed successfully: ${JSON.stringify(result)}`,
			);
			results.push(result);
		} catch (error) {
			pluginLogger.error(`Error executing plugin: ${error}`);
			results.push({
				pluginName: plugin.name,
				status: "failed",
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}
	logger.info(`Finished running plugins: ${JSON.stringify(results)}`);
	return results;
}

export type RunPluginsFn = typeof runPlugins;
