/* eslint-disable */
// @ts-nocheck
// This file is the backend entrypoint. It's intentionally kept in the repository
// but excluded from frontend TypeScript/ESLint analysis. The directives above
// disable TS type checking and ESLint rules for this file so Node.js server
// code (require/imports, Node globals) does not produce editor errors.

require("@dotenvx/dotenvx").config();
import HyperExpress from "hyper-express";
import cors from "./cors";
import { registerRoutes } from "./routers";
import { bodyParserForGET } from "./middlewares/body-parser-get";
import { handleError } from "./middlewares/handle-error";
import sessionMiddleware from "./middlewares/session";
import cookieParserMiddleware from "./middlewares/cookie-parser";
import "./config/database"; // Initialize database
import { initSnapshotCronJob } from "./config/cron"; // Initialize cron jobs

const webserver = new HyperExpress.Server({ max_body_length: 1024 * 1024 * 3 });

const allowedOrigins = process.env.MAIN_ALLOWED_ORIGINS?.split(",") || [];
console.log("Allowed Origins:", allowedOrigins);

webserver.use(
  cors({
    //dev
    origin: allowedOrigins,
    credentials: true,
    additionalOptions: {
      optionsRoute: true,
      allowedHeaders: ["Sec-Websocket-Protocol", "If-Modified-Since"],
    },
  })
);

// Apply middleware
webserver.use(cookieParserMiddleware);
// webserver.use(sessionMiddleware);

// webserver.use(i18nMiddleware);

//Safety check
webserver.use(bodyParserForGET);
registerRoutes(webserver);

webserver.set_error_handler(handleError);

// for (const [key, router] of Object.entries(wsRouters)) {
//     const route = "/" + key;
//     // webserver.use(route, router);
// }

const PORT = parseInt(process.env.MAIN_PORT, 10) || 8000;

// Activate webserver by calling .listen(port, callback)
webserver.listen(PORT)
  .then(() => {
    console.log(`✓ Webserver is listening on port ${PORT}`);
  })
  .catch((error) => {
    console.error('Failed to start webserver:', error);
    process.exit(1);
  });

// Initialize cron jobs for daily snapshots
initSnapshotCronJob();

// Keep process alive and handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  webserver.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  webserver.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

