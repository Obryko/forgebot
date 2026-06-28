import { access } from "node:fs/promises";
import { dirname, isAbsolute, join, parse, resolve } from "node:path";

export type ResolveConfigPathInput = {
	path?: string;
	defaultPath?: string;
	baseDir?: string;
};

async function fileExists(path: string): Promise<boolean> {
	return await access(path)
		.then(() => true)
		.catch(() => false);
}

async function findConfigPathUpwards(
	startDir: string,
	configFileName: string,
): Promise<string | null> {
	let currentDir = resolve(startDir);
	const root = parse(currentDir).root;

	while (true) {
		const candidate = join(currentDir, configFileName);

		if (await fileExists(candidate)) {
			return candidate;
		}

		if (currentDir === root) {
			return null;
		}

		currentDir = dirname(currentDir);
	}
}

export async function resolveConfigPath(
	input: ResolveConfigPathInput = {},
): Promise<string> {
	const configPath = input.path ?? input.defaultPath ?? "forgebot.yml";

	if (isAbsolute(configPath)) {
		return configPath;
	}

	const baseDir = input.baseDir ?? process.cwd();
	const foundPath = await findConfigPathUpwards(baseDir, configPath);

	if (foundPath) {
		return foundPath;
	}

	return resolve(baseDir, configPath);
}
