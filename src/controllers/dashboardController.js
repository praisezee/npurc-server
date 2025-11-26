const BoardMember = require("../models/BoardMember");
const Guideline = require("../models/Guideline");
const Publication = require("../models/Publication");
const Report = require("../models/Report");
const MediaAsset = require("../models/MediaAsset");
const ContactMessage = require("../models/ContactMessage");
const Initiative = require("../models/Initiative");
const { asyncHandler } = require("../utils/crudFactory");

const summarize = asyncHandler(async (req, res) => {
	const [
		boardCount,
		guidelineCount,
		publicationCount,
		reportCount,
		mediaCount,
		openContacts,
		activeInitiatives,
	] = await Promise.all([
		BoardMember.countDocuments(),
		Guideline.countDocuments({ status: "active" }),
		Publication.countDocuments(),
		Report.countDocuments(),
		MediaAsset.countDocuments(),
		ContactMessage.countDocuments({ status: { $ne: "resolved" } }),
		Initiative.find().sort({ updatedAt: -1 }).limit(6),
	]);

	res.json({
		metrics: {
			boardCount,
			guidelineCount,
			publicationCount,
			reportCount,
			mediaCount,
			openContacts,
		},
		initiatives: activeInitiatives,
	});
});

module.exports = {
	summarize,
};

