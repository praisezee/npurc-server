require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const start = async () => {
	await connectDB();

	const server = http.createServer(app);

	server.listen(PORT, () => {
		console.log(`🚀 CRM Backend ready on port ${PORT}`);
	});
};

start();

