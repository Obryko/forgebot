export type CodeChange = {
	id: string;
	title: string;
	description?: string;
	author: string;
	baseRef: string;
	headRef: string;
	baseSha: string;
	headSha: string;
	state: "open" | "closed" | "merged";
};
