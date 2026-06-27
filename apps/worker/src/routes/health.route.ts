import { Hono } from "hono";

export default function createHealthRoute() {
	const healthRoute = new Hono();

	healthRoute.get("/", (c) => {
		return c.json(
			{
				status: "ok",
			},
			200,
		);
	});

	return healthRoute;
}
