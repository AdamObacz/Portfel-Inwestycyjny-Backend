import HyperExpress from "hyper-express";
import * as TransactionService from "../services/TransactionService";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { createTransactionSchema, transactionFilterSchema } from "../dto/transaction.dto";

const router = new HyperExpress.Router();

// All routes require authentication
router.use(requireAuth);

/**
 * Create a new transaction
 * POST /api/transactions
 */
router.post("/", validate({ body: createTransactionSchema }), async (req: any, res: any) => {
  const userId = req.session.userId;
  const { assetId, type, quantity, price, note } = req.body;

  const transaction = await TransactionService.createTransaction(userId, assetId, type, quantity, price, note);

  return res.status(201).json({
    success: true,
    data: transaction,
  });
});

/**
 * Get all transactions with optional filters
 * GET /api/transactions?type=buy&assetId=xxx&limit=20&offset=0
 */
router.get("/", validate({ query: transactionFilterSchema }), async (req: any, res: any) => {
  const userId = req.session.userId;
  const { type, assetId, limit, offset } = req.query;

  const transactions = await TransactionService.getUserTransactions(userId, {
    type: type as "buy" | "sell" | undefined,
    assetId: assetId as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  return res.json({
    success: true,
    data: transactions,
  });
});

/**
 * Get recent transactions (last 10)
 * GET /api/transactions/recent?limit=10
 */
router.get("/recent", async (req: any, res: any) => {
  const userId = req.session.userId;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const transactions = await TransactionService.getRecentTransactions(userId, limit);

  return res.json({
    success: true,
    data: transactions,
  });
});

/**
 * Get transaction summary
 * GET /api/transactions/summary
 */
router.get("/summary", async (req: any, res: any) => {
  const userId = req.session.userId;
  const summary = await TransactionService.getTransactionSummary(userId);

  return res.json({
    success: true,
    data: summary,
  });
});

/**
 * Get single transaction by ID
 * GET /api/transactions/:id
 */
router.get("/:id", async (req: any, res: any) => {
  const userId = req.session.userId;
  const { id } = req.path_parameters;

  const transaction = await TransactionService.getTransactionById(userId, id);

  return res.json({
    success: true,
    data: transaction,
  });
});

/**
 * Delete transaction
 * DELETE /api/transactions/:id
 */
router.delete("/:id", async (req: any, res: any) => {
  const userId = req.session.userId;
  const { id } = req.path_parameters;

  const result = await TransactionService.deleteTransaction(userId, id);

  return res.json({
    success: true,
    message: result.message,
  });
});

export default router;
