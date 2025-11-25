import HyperExpress from "hyper-express";
import * as PortfolioService from "../services/PortfolioService";
import * as CryptoApiService from "../services/CryptoApiService";
import { validate } from "../middlewares/validate";
import { addToPortfolioSchema, updatePortfolioSchema } from "../dto/portfolio.dto";
import { requireAuth } from "../middlewares/requireAuth";

const router = new HyperExpress.Router();

// All routes require authentication
router.use(requireAuth);

/**
 * GET /portfolio
 * Get user's entire portfolio with current values
 */
router.get("/", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const portfolio = await PortfolioService.getUserPortfolio(userId);

    return res.status(200).json(portfolio);
  } catch (error: any) {
    console.error("Get portfolio error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * POST /portfolio
 * Add asset to portfolio
 */
router.post("/", validate({ body: addToPortfolioSchema }), async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const { assetId, quantity, purchasePrice } = req.locals.validatedData;

    const position = await PortfolioService.addToPortfolio(userId, assetId, quantity, purchasePrice);

    return res.status(201).json({
      message: "Asset added to portfolio successfully",
      position,
    });
  } catch (error: any) {
    console.error("Add to portfolio error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * PUT /portfolio/:id
 * Update portfolio position
 */
router.put("/:id", validate({ body: updatePortfolioSchema }), async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const positionId = req.path_parameters.id;
    const { quantity, purchasePrice } = req.locals.validatedData;

    const position = await PortfolioService.updatePosition(userId, positionId, quantity, purchasePrice);

    return res.status(200).json({
      message: "Position updated successfully",
      position,
    });
  } catch (error: any) {
    console.error("Update position error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * DELETE /portfolio/:id
 * Remove asset from portfolio
 */
router.delete("/:id", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const positionId = req.path_parameters.id;

    const result = await PortfolioService.removeFromPortfolio(userId, positionId);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Remove from portfolio error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * GET /portfolio/assets/search?q=bitcoin
 * Search for cryptocurrencies
 */
router.get("/assets/search", async (req: any, res: any) => {
  try {
    const query = req.query.q || "";

    if (!query || query.length < 1) {
      return res.status(400).json({
        error: "Search query is required",
        errorKey: "invalid_argument",
      });
    }

    const assets = await CryptoApiService.searchCryptoAssets(query);

    return res.status(200).json({
      results: assets,
    });
  } catch (error: any) {
    console.error("Search assets error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

export default router;
