export class ConfigNotFoundError extends Error {
	constructor(path: string) {
		super(`ForgeBot config file not found: ${path}`);
		this.name = "ConfigNotFoundError";
	}
}
