const express = require("express");
const BoardMember = require("../models/BoardMember");
const Guideline = require("../models/Guideline");
const Publication = require("../models/Publication");
const Report = require("../models/Report");
const MediaAsset = require("../models/MediaAsset");
const ContactMessage = require("../models/ContactMessage");
const Initiative = require("../models/Initiative");
const { prepareCrudController, buildCrudRouter } = require("../utils/crudFactory");
const { summarize } = require("../controllers/dashboardController");
const { chat } = require("../controllers/chatController");
const authRoutes = require("./auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

const register = (path, model, controllerOptions, routerOptions = {}) => {
	const controller = prepareCrudController(model, controllerOptions);
	const { secureMutations = true } = routerOptions;

	router.use(
		path,
		buildCrudRouter(controller, {
			secureMutations,
			protect,
		}),
	);
};

router.use("/auth", authRoutes);
router.get("/dashboard/summary", protect, summarize);
router.post("/chat", chat);

register("/boards", BoardMember, {
	resourceName: "Board member",
	fileFields: ["avatar"],
});

register("/guidelines", Guideline, {
	resourceName: "Guideline",
	fileFields: ["document"],
});

register("/publications", Publication, {
	resourceName: "Publication",
	fileFields: ["document", "coverImage"],
});

register("/reports", Report, {
	resourceName: "Report",
	fileFields: ["attachments"],
});

register("/media", MediaAsset, {
	resourceName: "Media asset",
	fileFields: ["file"],
});

register(
	"/contacts",
	ContactMessage,
	{
		resourceName: "Contact message",
	},
	{
		secureMutations: false,
	},
);

register("/initiatives", Initiative, {
	resourceName: "Initiative",
});

module.exports = router;


