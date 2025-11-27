import HyperExpress from "hyper-express";

interface CORSOptions {
  origin: string[] | string;
  credentials: boolean;
  additionalOptions?: {
    optionsRoute?: boolean;
    allowedHeaders?: string[];
    customSendHeaders?: string[];
  };
}

const cors = (options: CORSOptions) => {
  return async (
    request: HyperExpress.Request,
    response: HyperExpress.Response
  ) => {
    const allowedHeaders = options.additionalOptions?.allowedHeaders || [];
    const allowedOrigins = Array.isArray(options.origin)
      ? options.origin
      : [options.origin];

    const requestOrigin = request.header("origin");

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      response.header("Access-Control-Allow-Origin", requestOrigin);
      response.header("Access-Control-Allow-Credentials", "true");
      response.header("Vary", "Origin");
    }

    response.header(
      "Access-Control-Allow-Headers",
      `Content-Type, Authorization, X-Requested-With, ${allowedHeaders.join(
        ","
      )}`
    );
    response.header(
      "Access-Control-Expose-Headers",
      `Content-Type, Authorization, X-Requested-With, ${options?.additionalOptions?.customSendHeaders?.join(
        ","
      )}`
    );
    response.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, POST, GET, DELETE, PUT"
    );

    if (
      options.additionalOptions?.optionsRoute === true &&
      request.method === "OPTIONS"
    ) {
      response.status(204).send();
    }
  };
};

export default cors;
