import HyperExpress from "hyper-express";
import * as MarketService from "../services/MarketService";

const router = new HyperExpress.Router();

/**
 * Get all market indicators
 * GET /api/market/indicators
 */
router.get("/indicators", async (req: HyperExpress.Request, res: HyperExpress.Response) => {
  const indicators = await MarketService.getMarketIndicators();

  return res.json({
    success: true,
    data: indicators,
  });
});

/**
 * Get global market data only
 * GET /api/market/global
 */
router.get("/global", async (req: HyperExpress.Request, res: HyperExpress.Response) => {
  const marketData = await MarketService.getGlobalMarketData();

  return res.json({
    success: true,
    data: marketData,
  });
});

/**
 * Get Fear & Greed Index only
 * GET /api/market/fear-greed
 */
router.get("/fear-greed", async (req: HyperExpress.Request, res: HyperExpress.Response) => {
  const fearGreed = await MarketService.getFearGreedIndex();

  return res.json({
    success: true,
    data: fearGreed,
  });
});

export default router;
