import { serve } from "bun";
import createApp from "./app.ts";
import createDependencies from "./dependencies.ts";

const deps = createDependencies();
const app = createApp(deps);

serve({
	fetch: app.fetch,
	port: 3000,
});
