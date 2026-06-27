export type PluginResultStatus = "success" | "skipped" | "failed";

export interface PluginResult {
	pluginName: string;
	status: PluginResultStatus;
	message?: string;
}
