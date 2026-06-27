import type { ForgeBotContext } from "./context.ts";
import type { ForgeBotPlugin } from "./plugin.ts";
import type { PluginResult } from "./result.ts";

export async function runPlugins(
	plugins: ForgeBotPlugin[],
	context: ForgeBotContext,
): Promise<PluginResult[]> {
	const results: PluginResult[] = [];
	for (const plugin of plugins) {
		if (!plugin.supports(context.event)) {
			continue;
		}
		try {
			const result = await plugin.run(context);
			context.logger.info(
				`Plugin ${plugin.name} executed successfully: ${JSON.stringify(result)}`,
			);
			results.push(result);
		} catch (error) {
			context.logger.error(`Error executing plugin ${plugin.name}: ${error}`);
			results.push({
				pluginName: plugin.name,
				status: "failed",
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}
	return results;
}
