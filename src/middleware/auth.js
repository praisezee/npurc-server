const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const { asyncHandler } = require("../utils/crudFactory");

exports.protect = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

	if (!token) {
		return res.status(401).json({ message: "Authentication required." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const admin = await AdminUser.findById(decoded.id);

		if (!admin) {
			return res.status(401).json({ message: "Admin account not found." });
		}

		req.user = { id: admin._id.toString(), role: admin.role };
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token." });
	}
});


