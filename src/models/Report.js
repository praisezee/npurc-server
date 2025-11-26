const { Schema, model } = require("mongoose");

const metricSchema = new Schema(
	{
		label: String,
		value: Number,
		delta: Number,
		unit: String,
	},
	{ _id: false },
);

const reportSchema = new Schema(
	{
		title: { type: String, required: true },
		period: String,
		status: {
			type: String,
			enum: ["draft", "in-review", "approved"],
			default: "draft",
		},
		owner: String,
		metrics: [metricSchema],
		attachments: [
			{
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
		],
	},
	{ timestamps: true },
);

module.exports = model("Report", reportSchema);

