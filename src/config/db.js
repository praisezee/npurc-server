const mongoose = require("mongoose");

const connectDB = async () => {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		throw new Error("Missing MONGODB_URI in environment variables");
	}

	try {
		await mongoose.connect(mongoUri);

		console.log("✅ MongoDB connected");
	} catch (error) {
		console.error("❌ MongoDB connection error:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
