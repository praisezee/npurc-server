const { Schema, model } = require("mongoose");

const guidelineSchema = new Schema(
	{
		title: { type: String, required: true },
		category: { type: String, default: "General" },
		summary: String,
		status: {
			type: String,
			enum: ["draft", "active", "retired"],
			default: "active",
		},
		document: {
			meta: {
				filename: String,
				mimeType: String,
				size: Number,
				originalSize: Number,
				compressedSize: Number,
				encoding: String,
				isCompressed: Boolean,
			},
			data: String,
		},
	},
	{ timestamps: true },
);

module.exports = model("Guideline", guidelineSchema);

