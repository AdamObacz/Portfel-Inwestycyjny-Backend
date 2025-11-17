import "express-session";

declare module "hyper-express" {
  interface Request {
    session?: any;
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export {};
