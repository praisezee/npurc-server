const { Schema, model } = require("mongoose");

const publicationSchema = new Schema(
	{
		title: { type: String, required: true },
		summary: String,
		author: String,
		publishedOn: { type: Date, default: Date.now },
		tags: [String],
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
		coverImage: {
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

module.exports = model("Publication", publicationSchema);

