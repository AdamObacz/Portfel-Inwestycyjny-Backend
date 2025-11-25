"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
/**
 * Middleware to require authentication
 * Checks if user is logged in via session
 */
function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            error: "Authentication required",
            errorKey: "unauthorized",
        });
    }
    // User is authenticated, proceed
    next();
}
exports.default = requireAuth;
