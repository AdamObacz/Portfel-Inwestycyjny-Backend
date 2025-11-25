import HyperExpress from "hyper-express";
import testRouter from "./test";
import authRouter from "./auth";
import portfolioRouter from "./portfolio";
import reportsRouter from "./reports";

export function registerRoutes(app: HyperExpress.Server) {
  app.use("/api/auth", authRouter);
  app.use("/api/portfolio", portfolioRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api", testRouter);
}
