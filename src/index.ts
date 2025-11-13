/* eslint-disable */
// @ts-nocheck
// This file is the backend entrypoint. It's intentionally kept in the repository
// but excluded from frontend TypeScript/ESLint analysis. The directives above
// disable TS type checking and ESLint rules for this file so Node.js server
// code (require/imports, Node globals) does not produce editor errors.

require("@dotenvx/dotenvx").config();
import cors from "./cors";
import HyperExpress from "hyper-express";
import { bodyParserForGET } from "./middlewares/body-parser-get";
import { registerRoutes } from "./routers";
import { handleError } from "./middlewares/handle-error";

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
webserver.listen(PORT);
console.log(`Webserver is listening on port ${PORT}`);
