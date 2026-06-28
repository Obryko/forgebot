import { describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { resolveConfigPath } from "./config-path.ts";

describe("resolveConfigPath", () => {
	it("should return absolute path as-is", async () => {
		const path = join(tmpdir(), "forgebot.yml");

		const resolvedPath = await resolveConfigPath({
			path,
		});

		expect(resolvedPath).toBe(path);
	});

	it("should find config in base directory", async () => {
		const directory = await mkdtemp(join(tmpdir(), "forgebot-config-path-"));
		const configPath = join(directory, "forgebot.yml");

		try {
			await writeFile(configPath, "plugins: []", "utf8");

			const resolvedPath = await resolveConfigPath({
				baseDir: directory,
			});

			expect(resolvedPath).toBe(configPath);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});

	it("should find config in parent directory", async () => {
		const directory = await mkdtemp(join(tmpdir(), "forgebot-config-path-"));
		const nestedDirectory = join(directory, "apps", "worker");
		const configPath = join(directory, "forgebot.yml");

		try {
			await mkdir(nestedDirectory, { recursive: true });
			await writeFile(configPath, "plugins: []", "utf8");

			const resolvedPath = await resolveConfigPath({
				baseDir: nestedDirectory,
			});

			expect(resolvedPath).toBe(configPath);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});

	it("should resolve missing config path relative to base directory", async () => {
		const directory = await mkdtemp(join(tmpdir(), "forgebot-config-path-"));

		try {
			const resolvedPath = await resolveConfigPath({
				baseDir: directory,
			});

			expect(resolvedPath).toBe(resolve(directory, "forgebot.yml"));
			expect(isAbsolute(resolvedPath)).toBe(true);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});

	it("should use custom default path", async () => {
		const directory = await mkdtemp(join(tmpdir(), "forgebot-config-path-"));
		const configPath = join(directory, "forgebot.local.yml");

		try {
			await writeFile(configPath, "plugins: []", "utf8");

			const resolvedPath = await resolveConfigPath({
				baseDir: directory,
				defaultPath: "forgebot.local.yml",
			});

			expect(resolvedPath).toBe(configPath);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});

	it("should prefer explicit path over default path", async () => {
		const directory = await mkdtemp(join(tmpdir(), "forgebot-config-path-"));
		const explicitConfigPath = join(directory, "custom.yml");
		const defaultConfigPath = join(directory, "forgebot.yml");

		try {
			await writeFile(explicitConfigPath, "plugins: []", "utf8");
			await writeFile(defaultConfigPath, "plugins: []", "utf8");

			const resolvedPath = await resolveConfigPath({
				baseDir: directory,
				path: "custom.yml",
				defaultPath: "forgebot.yml",
			});

			expect(resolvedPath).toBe(explicitConfigPath);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});
});
