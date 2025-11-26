const { Schema, model } = require("mongoose");

const contactMessageSchema = new Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true },
		organization: String,
		topic: String,
		message: { type: String, required: true },
		status: {
			type: String,
			enum: ["new", "in-progress", "resolved"],
			default: "new",
		},
	},
	{ timestamps: true },
);

module.exports = model("ContactMessage", contactMessageSchema);

