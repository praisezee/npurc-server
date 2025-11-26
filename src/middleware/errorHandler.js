const notFound = (req, res) => {
	res.status(404).json({
		message: `Route ${req.originalUrl} not found`,
	});
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
	console.error(err);
	const status = err.status || 500;
	res.status(status).json({
		message: err.message || "Server error",
		stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
	});
};

module.exports = {
	notFound,
	errorHandler,
};

