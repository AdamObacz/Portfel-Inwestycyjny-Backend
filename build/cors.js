"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cors;
// Minimal CORS middleware stub for backend entry
// Use specific/safer types to avoid `any` diagnostics in the frontend toolchain.
function cors() {
    // Return a middleware-like function compatible with many frameworks
    return function (_req, _res, _next) {
        // no-op stub — pass control to next if provided
        _next === null || _next === void 0 ? void 0 : _next();
    };
}
