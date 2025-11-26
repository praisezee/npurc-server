const { Schema, model } = require("mongoose");

const boardMemberSchema = new Schema(
	{
		name: { type: String, required: true },
		role: { type: String, required: true },
		email: { type: String },
		phone: { type: String },
		bio: { type: String },
		priority: { type: Number, default: 0 },
		avatar: {
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

module.exports = model("BoardMember", boardMemberSchema);

