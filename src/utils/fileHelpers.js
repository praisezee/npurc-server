const { brotliCompressSync, brotliDecompressSync } = require("zlib");

const BROTLI_OPTIONS = {
	params: {
		[require("zlib").constants.BROTLI_PARAM_QUALITY]: 11,
	},
};

const BINARY_MIME_TYPES = ["image/", "application/pdf"];

const isBinaryMime = (mime = "") =>
	BINARY_MIME_TYPES.some((type) => mime.startsWith(type));

const bufferToBase64 = (buffer) => buffer.toString("base64");

const base64ToBuffer = (base64) => Buffer.from(base64, "base64");

const compressAsBase64 = (buffer) => {
	const compressed = brotliCompressSync(buffer, BROTLI_OPTIONS);
	return {
		compressedBase64: bufferToBase64(compressed),
		originalSize: buffer.byteLength,
		compressedSize: compressed.byteLength,
	};
};

const decompressBase64 = (compressedBase64) => {
	const buffer = base64ToBuffer(compressedBase64);
	return brotliDecompressSync(buffer);
};

const sanitizeFileMeta = ({ filename, originalname, mimetype, size }) => ({
	filename: filename || originalname || "file",
	mimeType: mimetype || "application/octet-stream",
	size,
});

const buildFilePayload = ({ fileBuffer, fileMeta }) => {
	if (!fileBuffer || !fileMeta.mimeType || !isBinaryMime(fileMeta.mimeType)) {
		return null;
	}

	const { compressedBase64, originalSize, compressedSize } = compressAsBase64(fileBuffer);

	return {
		meta: {
			...fileMeta,
			originalSize,
			compressedSize,
			encoding: "base64",
			isCompressed: true,
		},
		data: compressedBase64,
	};
};

const expandFilePayload = (fileDoc) => {
	if (!fileDoc?.data || !fileDoc?.meta) {
		return null;
	}

	try {
		const decompressed = decompressBase64(fileDoc.data);
		return {
			...fileDoc.meta,
			base64: bufferToBase64(decompressed),
		};
	} catch (error) {
		console.error("Failed to decompress asset:", error.message);
		return fileDoc.meta;
	}
};

module.exports = {
	isBinaryMime,
	buildFilePayload,
	expandFilePayload,
	base64ToBuffer,
	sanitizeFileMeta,
};

