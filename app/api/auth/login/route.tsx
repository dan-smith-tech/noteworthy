export async function POST(req: Request) {
	return new Response(
		JSON.stringify({
			status: 501,
			message: "Authentication not available.",
			data: {},
		})
	);
}
