const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const { asyncHandler } = require("../utils/crudFactory");

const signToken = (userId) =>
	jwt.sign(
		{
			id: userId,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN || "7d",
		},
	);

const buildAuthResponse = (admin) => ({
	token: signToken(admin._id),
	user: admin.toSafeObject(),
});

exports.signup = asyncHandler(async (req, res) => {
	const { fullName, email, password, department, role } = req.body;

	if (!fullName || !email || !password) {
		return res.status(400).json({ message: "Full name, email, and password are required." });
	}

	const existing = await AdminUser.findOne({ email });
	if (existing) {
		return res.status(409).json({ message: "An admin with this email already exists." });
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const admin = await AdminUser.create({
		fullName,
		email,
		password: hashedPassword,
		department,
		role,
	});

	res.status(201).json(buildAuthResponse(admin));
});

exports.login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required." });
	}

	const admin = await AdminUser.findOne({ email }).select("+password");
	if (!admin) {
		return res.status(401).json({ message: "Invalid credentials." });
	}

	const isMatch = await bcrypt.compare(password, admin.password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid credentials." });
	}

	admin.lastLogin = new Date();
	await admin.save();

	res.json(buildAuthResponse(admin));
});

exports.me = asyncHandler(async (req, res) => {
	const admin = await AdminUser.findById(req.user.id);
	if (!admin) {
		return res.status(404).json({ message: "Admin not found." });
	}
	res.json({ user: admin.toSafeObject() });
});


