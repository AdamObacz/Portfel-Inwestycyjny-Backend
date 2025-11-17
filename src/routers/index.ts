import HyperExpress from "hyper-express";
import testRouter from "./test";
import authRouter from "./auth";

export function registerRoutes(app: HyperExpress.Server) {
  app.use("/api/auth", authRouter);
  app.use("/api", testRouter);
}
