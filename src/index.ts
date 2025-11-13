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
    origin: allowedOrigins,
    credentials: true,
    additionalOptions: {
      optionsRoute: true,
      allowedHeaders: ["Sec-Websocket-Protocol", "If-Modified-Since"],
    },
  })
);

webserver.use(bodyParserForGET);
registerRoutes(webserver);

webserver.set_error_handler(handleError);

const PORT = parseInt(process.env.MAIN_PORT, 10) || 8000;
webserver.listen(PORT);
console.log(`Webserver is listening on port ${PORT}`);
