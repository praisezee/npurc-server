const express = require("express");
const {
	buildFilePayload,
	expandFilePayload,
	base64ToBuffer,
	sanitizeFileMeta,
} = require("./fileHelpers");

const asyncHandler =
	(fn) =>
	(req, res, next) =>
		Promise.resolve(fn(req, res, next)).catch(next);

const mapFileFields = (body = {}, fileFields = []) => {
	const nextBody = { ...body };

	fileFields.forEach((field) => {
		const payload = body[field];

		if (!payload) return;

		if (payload?.remove) {
			nextBody[field] = undefined;
			return;
		}

		const transform = (fileObject) => {
			if (fileObject?.base64 && fileObject?.mimeType) {
				const fileBuffer = base64ToBuffer(fileObject.base64);
				const fileMeta = sanitizeFileMeta({
					filename: fileObject.filename,
					mimetype: fileObject.mimeType,
					size: fileObject.size || fileBuffer.byteLength,
				});
				return buildFilePayload({ fileBuffer, fileMeta });
			}
			return fileObject;
		};

		if (Array.isArray(payload)) {
			nextBody[field] = payload.map(transform).filter(Boolean);
		} else {
			nextBody[field] = transform(payload);
		}
	});

	return nextBody;
};

const expandFilesOnDoc = (doc, fileFields = []) => {
	if (!doc) return null;
	const obj = doc.toObject({ versionKey: false });

	fileFields.forEach((field) => {
		if (!obj[field]) return;

		if (Array.isArray(obj[field])) {
			obj[field] = obj[field].map((item) => expandFilePayload(item));
		} else {
			obj[field] = expandFilePayload(obj[field]);
		}
	});

	return obj;
};

const prepareCrudController = (Model, options = {}) => {
	const { resourceName = "resource", fileFields = [] } = options;
	const withFiles = (payload) => mapFileFields(payload, fileFields);
	const format = (doc) => expandFilesOnDoc(doc, fileFields);

	return {
		list: asyncHandler(async (req, res) => {
			const docs = await Model.find(req.query || {}).sort({ updatedAt: -1 });
			res.json(docs.map((doc) => format(doc)));
		}),
		getOne: asyncHandler(async (req, res) => {
			const doc = await Model.findById(req.params.id);
			if (!doc) {
				return res.status(404).json({ message: `${resourceName} not found` });
			}
			res.json(format(doc));
		}),
		create: asyncHandler(async (req, res) => {
			const doc = await Model.create(withFiles(req.body));
			res.status(201).json(format(doc));
		}),
		update: asyncHandler(async (req, res) => {
			const doc = await Model.findByIdAndUpdate(
				req.params.id,
				withFiles(req.body),
				{
					new: true,
					runValidators: true,
				},
			);

			if (!doc) {
				return res.status(404).json({ message: `${resourceName} not found` });
			}

			res.json(format(doc));
		}),
		remove: asyncHandler(async (req, res) => {
			const doc = await Model.findByIdAndDelete(req.params.id);
			if (!doc) {
				return res.status(404).json({ message: `${resourceName} not found` });
			}
			res.json({ message: `${resourceName} deleted` });
		}),
	};
};

module.exports = {
	asyncHandler,
	prepareCrudController,
	buildCrudRouter: (controller, options = {}) => {
		const router = express.Router();
		const { secureMutations = false, protect } = options;
		const guard = secureMutations && typeof protect === "function" ? protect : null;

		const withGuard = (handler) => (guard ? [guard, handler] : [handler]);

		router.get("/", controller.list);
		router.get("/:id", controller.getOne);
		router.post("/", ...withGuard(controller.create));
		router.put("/:id", ...withGuard(controller.update));
		router.delete("/:id", ...withGuard(controller.remove));
		return router;
	},
};
