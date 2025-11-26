const { Schema, model } = require("mongoose");

const mediaAssetSchema = new Schema(
	{
		title: { type: String, required: true },
		type: {
			type: String,
			enum: ["image", "video", "audio", "document"],
			default: "image",
		},
		caption: String,
		altText: String,
		file: {
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

module.exports = model("MediaAsset", mediaAssetSchema);

