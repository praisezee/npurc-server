const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["administrator", "editor", "viewer"],
			default: "administrator",
		},
		department: {
			type: String,
			trim: true,
		},
		lastLogin: Date,
	},
	{
		timestamps: true,
	},
);

adminSchema.methods.toSafeObject = function toSafeObject() {
	const obj = this.toObject({ versionKey: false });
	delete obj.password;
	return obj;
};

module.exports = mongoose.model("AdminUser", adminSchema);


