import HyperExpress from "hyper-express";
import * as ReportService from "../services/ReportService";
import { requireAuth } from "../middlewares/requireAuth";

const router = new HyperExpress.Router();

// All routes require authentication
router.use(requireAuth);

/**
 * GET /reports/daily
 * Get daily report (today vs yesterday)
 */
router.get("/daily", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const report = await ReportService.getDailyReport(userId);

    return res.status(200).json(report);
  } catch (error: any) {
    console.error("Get daily report error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * GET /reports/monthly
 * Get monthly report for current month
 */
router.get("/monthly", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const report = await ReportService.getMonthlyReport(userId);

    return res.status(200).json(report);
  } catch (error: any) {
    console.error("Get monthly report error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * GET /reports/performance?from=2025-01-01&to=2025-11-24
 * Get performance report for custom date range
 */
router.get("/performance", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const from = req.query.from;
    const to = req.query.to;

    const report = await ReportService.getPerformanceReport(userId, from, to);

    return res.status(200).json(report);
  } catch (error: any) {
    console.error("Get performance report error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * GET /reports/snapshots?limit=30
 * Get historical snapshots
 */
router.get("/snapshots", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const limit = parseInt(req.query.limit || "30", 10);

    const snapshots = await ReportService.getUserSnapshots(userId, limit);

    return res.status(200).json({
      snapshots,
    });
  } catch (error: any) {
    console.error("Get snapshots error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

/**
 * POST /reports/snapshot
 * Manually create a snapshot (useful for testing)
 */
router.post("/snapshot", async (req: any, res: any) => {
  try {
    const userId = req.session.userId;
    const snapshot = await ReportService.createSnapshot(userId);

    return res.status(201).json({
      message: "Snapshot created successfully",
      snapshot,
    });
  } catch (error: any) {
    console.error("Create snapshot error:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message,
      errorKey: error.errorKey || "internal_server_error",
    });
  }
});

export default router;
