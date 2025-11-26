const OpenAI = require("openai");
const { asyncHandler } = require("../utils/crudFactory");

const buildFallbackReply = (message = "") => {
	if (!message) {
		return "Hello! I'm your CRM assistant. Ask me about boards, guidelines, or media assets.";
	}

	if (/guideline/i.test(message)) {
		return "Guidelines can be created, updated, or retired from the Guidelines workspace.";
	}
	if (/report/i.test(message)) {
		return "Reports track KPIs and their attachments. Navigate to the Reports hub inside the dashboard.";
	}
	return "I'm here to help with CRM insights, data hygiene tips, and navigation support.";
};

const chat = asyncHandler(async (req, res) => {
	const { message } = req.body;

	if (!message) {
		return res.status(400).json({ message: "Message is required" });
	}

	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		return res.json({ reply: buildFallbackReply(message), provider: "fallback" });
	}

	const client = new OpenAI({ apiKey });

	const completion = await client.responses.create({
		model: process.env.OPENAI_MODEL || "gpt-4o-mini",
		input: [
			{
				role: "system",
				content:
					"You are an assistant for a CRM dashboard. Keep answers concise and actionable.",
			},
			{ role: "user", content: message },
		],
	});

	const firstOutput = completion.output?.[0];
	const firstContent = firstOutput?.content?.[0];
	const reply =
		firstContent?.type === "output_text"
			? firstContent.text?.value
			: typeof firstContent?.text === "string"
				? firstContent.text
				: undefined;

	res.json({
		reply: reply || buildFallbackReply(message),
		provider: "openai",
	});
});

module.exports = { chat };

