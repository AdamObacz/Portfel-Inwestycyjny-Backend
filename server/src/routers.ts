import express from "express";
import { getRoot, getHealth, getApiTest, getPortfolio } from "./controller";

export function registerRoutes(webserver: express.Express) {
  // Basic test routes to verify server is working
  webserver.get("/", getRoot);
  webserver.get("/health", getHealth);
  webserver.get("/api/test", getApiTest);

  // Example portfolio endpoint: /api/portfolio?user=demo
  webserver.get("/api/portfolio", getPortfolio);
}
