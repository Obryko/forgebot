export type RepositoryFileStatus = "added" | "modified" | "removed" | "renamed";

export type RepositoryFile = {
	path: string;
	status: RepositoryFileStatus;
	previousPath?: string;
	additions?: number;
	deletions?: number;
};
