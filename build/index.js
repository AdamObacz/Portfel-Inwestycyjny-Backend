"use strict";
/* eslint-disable */
// @ts-nocheck
// This file is the backend entrypoint. It's intentionally kept in the repository
// but excluded from frontend TypeScript/ESLint analysis. The directives above
// disable TS type checking and ESLint rules for this file so Node.js server
// code (require/imports, Node globals) does not produce editor errors.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("@dotenvx/dotenvx").config();
const hyper_express_1 = __importDefault(require("hyper-express"));
const cors_1 = __importDefault(require("./cors"));
const routers_1 = require("./routers");
const body_parser_get_1 = require("./middlewares/body-parser-get");
const handle_error_1 = require("./middlewares/handle-error");
const session_1 = __importDefault(require("./middlewares/session"));
const cookie_parser_1 = __importDefault(require("./middlewares/cookie-parser"));
require("./config/database"); // Initialize database
const cron_1 = require("./config/cron"); // Initialize cron jobs
const webserver = new hyper_express_1.default.Server({ max_body_length: 1024 * 1024 * 3 });
const allowedOrigins = ((_a = process.env.MAIN_ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
console.log("Allowed Origins:", allowedOrigins);
webserver.use((0, cors_1.default)({
    //dev
    origin: allowedOrigins,
    credentials: true,
    additionalOptions: {
        optionsRoute: true,
        allowedHeaders: ["Sec-Websocket-Protocol", "If-Modified-Since"],
    },
}));
// Apply middleware
webserver.use(cookie_parser_1.default);
webserver.use(session_1.default);
// webserver.use(i18nMiddleware);
//Safety check
webserver.use(body_parser_get_1.bodyParserForGET);
(0, routers_1.registerRoutes)(webserver);
webserver.set_error_handler(handle_error_1.handleError);
// for (const [key, router] of Object.entries(wsRouters)) {
//     const route = "/" + key;
//     // webserver.use(route, router);
// }
const PORT = parseInt(process.env.MAIN_PORT, 10) || 8000;
// Activate webserver by calling .listen(port, callback)
webserver.listen(PORT)
    .then(() => {
    console.log(`Webserver is listening on port ${PORT}`);
})
    .catch((error) => {
    console.error('Failed to start webserver:', error);
    process.exit(1);
});
// Initialize cron jobs for daily snapshots
(0, cron_1.initSnapshotCronJob)();
// Keep process alive
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing server');
    process.exit(0);
});
