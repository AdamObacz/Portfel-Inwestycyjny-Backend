"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
function handleError(err, _req, res) {
    // Minimal error handler stub used by HyperExpress set_error_handler
    try {
        // If response object has a status/send methods, attempt to respond
        if (res && typeof res.status === "function") {
            res.status(500).send({ error: String(err) });
        }
    }
    catch (_) {
        // swallow
    }
}
