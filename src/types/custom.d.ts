// Type declarations for backend-only or untyped modules used in `src/index.ts`
declare module "hyper-express" {
  const value: any;
  export default value;
}

declare module "@dotenvx/dotenvx" {
  const value: any;
  export default value;
}

// If you import `./cors` as a local module without types, declare it here
declare module "./cors" {
  const value: any;
  export default value;
}

declare module "./middlewares/body-parser-get" {
  const value: any;
  export = value;
}

declare module "./middlewares/handle-error" {
  const value: any;
  export = value;
}

declare module "./routers" {
  const value: any;
  export = value;
}

// Allow requiring modules in some backend files (if used)
declare var require: any;

// Extend process.env typing if needed (optional)
declare namespace NodeJS {
  interface ProcessEnv {
    MAIN_PORT: string;
    MAIN_ALLOWED_ORIGINS?: string;
  }
}

// Fallbacks to silence unresolved import/type errors for backend-only files
declare const process: any;
declare module "*";
declare module "hyper-express";
declare module "@dotenvx/dotenvx";
declare module "./cors";
declare module "./middlewares/body-parser-get";
declare module "./routers";
declare module "./middlewares/handle-error";

declare var require: any;

declare namespace NodeJS {
  interface ProcessEnv {
    MAIN_PORT: string;
    MAIN_ALLOWED_ORIGINS?: string;
  }
}
