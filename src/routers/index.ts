import HyperExpress from "hyper-express";
import testRouter from "./test";
export function registerRoutes(app: HyperExpress.Server) {
  app.use("/api", testRouter);
}
