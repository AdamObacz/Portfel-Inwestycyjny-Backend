import HyperExpress from "hyper-express";
import testRouter from "./test";
import authRouter from "./auth";
import portfolioRouter from "./portfolio";
import reportsRouter from "./reports";
import transactionRouter from "./transaction";
import marketRouter from "./market";

export function registerRoutes(app: HyperExpress.Server) {
  app.use("/api/auth", authRouter);
  app.use("/api/portfolio", portfolioRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api/transactions", transactionRouter);
  app.use("/api/market", marketRouter);
  app.use("/api", testRouter);
}
