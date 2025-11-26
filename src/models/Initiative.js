const { Schema, model } = require("mongoose");

const initiativeSchema = new Schema(
	{
		title: { type: String, required: true },
		owner: String,
		status: {
			type: String,
			enum: ["not-started", "in-progress", "completed"],
			default: "not-started",
		},
		progress: { type: Number, default: 0 },
		description: String,
		startDate: Date,
		targetDate: Date,
		tags: [String],
	},
	{ timestamps: true },
);

module.exports = model("Initiative", initiativeSchema);

