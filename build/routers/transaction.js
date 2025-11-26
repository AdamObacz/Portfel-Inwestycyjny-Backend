"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hyper_express_1 = __importDefault(require("hyper-express"));
const TransactionService = __importStar(require("../services/TransactionService"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const validate_1 = require("../middlewares/validate");
const transaction_dto_1 = require("../dto/transaction.dto");
const router = new hyper_express_1.default.Router();
/**
 * Create a new transaction
 * POST /api/transactions
 */
router.post("/", requireAuth_1.default, (0, validate_1.validate)({ body: transaction_dto_1.createTransactionSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const { assetId, type, quantity, price, note } = req.body;
    const transaction = yield TransactionService.createTransaction(userId, assetId, type, quantity, price, note);
    return res.status(201).json({
        success: true,
        data: transaction,
    });
}));
/**
 * Get all transactions with optional filters
 * GET /api/transactions?type=buy&assetId=xxx&limit=20&offset=0
 */
router.get("/", requireAuth_1.default, (0, validate_1.validate)({ query: transaction_dto_1.transactionFilterSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const { type, assetId, limit, offset } = req.query;
    const transactions = yield TransactionService.getUserTransactions(userId, {
        type: type,
        assetId: assetId,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
    });
    return res.json({
        success: true,
        data: transactions,
    });
}));
/**
 * Get recent transactions (last 10)
 * GET /api/transactions/recent?limit=10
 */
router.get("/recent", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const transactions = yield TransactionService.getRecentTransactions(userId, limit);
    return res.json({
        success: true,
        data: transactions,
    });
}));
/**
 * Get transaction summary
 * GET /api/transactions/summary
 */
router.get("/summary", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const summary = yield TransactionService.getTransactionSummary(userId);
    return res.json({
        success: true,
        data: summary,
    });
}));
/**
 * Get single transaction by ID
 * GET /api/transactions/:id
 */
router.get("/:id", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const { id } = req.path_parameters;
    const transaction = yield TransactionService.getTransactionById(userId, id);
    return res.json({
        success: true,
        data: transaction,
    });
}));
/**
 * Delete transaction
 * DELETE /api/transactions/:id
 */
router.delete("/:id", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const { id } = req.path_parameters;
    const result = yield TransactionService.deleteTransaction(userId, id);
    return res.json({
        success: true,
        message: result.message,
    });
}));
exports.default = router;
