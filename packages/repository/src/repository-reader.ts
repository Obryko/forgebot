import type { CodeChange } from "./code-change.ts";
import type { RepositoryFile } from "./repository-file.ts";

export type ReadRepositoryFileInput = { path: string; ref: string };

export interface RepositoryReader {
	getCodeChange(): Promise<CodeChange>;
	listChangedFiles(): Promise<RepositoryFile[]>;
	getDiff(): Promise<string>;
	readFile(input: ReadRepositoryFileInput): Promise<string | null>;
}
