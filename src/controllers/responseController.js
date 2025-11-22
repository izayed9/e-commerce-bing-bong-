/**
 * Response helpers (ES module)
 * - Standardize successful responses, errors, async wrapper, and pagination meta.
 * - Exported helpers are safe to import individually or via default export.
 */

const DEFAULT_SUCCESS_MESSAGES = {
	200: 'OK',
	201: 'Created',
	204: 'No Content',
};

function sendResponse(res, options = {}) {
	const {
		status = 200,
		success = status >= 200 && status < 300,
		message = DEFAULT_SUCCESS_MESSAGES[status] || '',
		data = null,
		meta = null,
		headers = null,
	} = options;

	if (headers && typeof headers === 'object') res.set(headers);

	if (status === 204) return res.status(204).end();

	const payload = { success, message };
	if (data !== null) payload.data = data;
	if (meta != null) payload.meta = meta;

	return res.status(status).json(payload);
}

// Convenience wrappers
function ok(res, data = null, message = null, meta = null, headers = null) {
	return sendResponse(res, {
		status: 200,
		success: true,
		message: message || DEFAULT_SUCCESS_MESSAGES[200],
		data,
		meta,
		headers,
	});
}

function created(res, data = null, message = null, meta = null, headers = null) {
	return sendResponse(res, {
		status: 201,
		success: true,
		message: message || DEFAULT_SUCCESS_MESSAGES[201],
		data,
		meta,
		headers,
	});
}

function noContent(res, headers = null) {
	return sendResponse(res, { status: 204, success: true, message: DEFAULT_SUCCESS_MESSAGES[204], data: null, headers });
}

function badRequest(res, message = 'Bad Request', details = null) {
	return sendResponse(res, { status: 400, success: false, message, data: null, meta: details });
}

function unauthorized(res, message = 'Unauthorized', details = null) {
	return sendResponse(res, { status: 401, success: false, message, data: null, meta: details });
}

function forbidden(res, message = 'Forbidden', details = null) {
	return sendResponse(res, { status: 403, success: false, message, data: null, meta: details });
}

function notFound(res, message = 'Not Found', details = null) {
	return sendResponse(res, { status: 404, success: false, message, data: null, meta: details });
}

function unprocessable(res, message = 'Unprocessable Entity', details = null) {
	return sendResponse(res, { status: 422, success: false, message, data: null, meta: details });
}

function serverError(res, message = 'Internal Server Error', details = null) {
	return sendResponse(res, { status: 500, success: false, message, data: null, meta: details });
}

// Express error-handling middleware (convenience; app.js currently provides its own)
function errorHandler(err, req, res, next) {
	if (res.headersSent) return next(err);

	const status = err.status || err.statusCode || (err.name === 'ValidationError' ? 422 : 500);
	const message = err.message || (status >= 500 ? 'Internal Server Error' : 'Error');
	const details = err.errors || err.details || null;

	return sendResponse(res, { status, success: false, message, data: null, meta: details });
}

// Async wrapper to forward errors to next()
function catchAsync(fn) {
	return function wrapped(req, res, next) {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

// Helper to generate pagination meta
function makePagination({ total = 0, page = 1, limit = 10 } = {}) {
	const pages = Math.max(1, Math.ceil(total / limit));
	return {
		total,
		page,
		limit,
		pages,
		hasNext: page < pages,
		hasPrev: page > 1,
	};
}

// Aliases commonly used in controllers
const sendSuccess = (res, data = null, message = 'Success', status = 200) => sendResponse(res, { status, success: true, message, data });
const sendCreated = (res, data = null, message = 'Created') => sendResponse(res, { status: 201, success: true, message, data });
const asyncHandler = catchAsync;

export {
	sendResponse,
	ok,
	created,
	noContent,
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	unprocessable,
	serverError,
	errorHandler,
	catchAsync,
	makePagination,
	sendSuccess,
	sendCreated,
	asyncHandler,
};

export default {
	ok,
	created,
	noContent,
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	unprocessable,
	serverError,
	errorHandler,
	catchAsync,
	makePagination,
	sendSuccess,
	sendCreated,
	asyncHandler,
};

