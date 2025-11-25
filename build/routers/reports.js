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
const ReportService = __importStar(require("../services/ReportService"));
const requireAuth_1 = require("../middlewares/requireAuth");
const router = new hyper_express_1.default.Router();
// All routes require authentication
router.use(requireAuth_1.requireAuth);
/**
 * GET /reports/daily
 * Get daily report (today vs yesterday)
 */
router.get("/daily", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const report = yield ReportService.getDailyReport(userId);
        return res.status(200).json(report);
    }
    catch (error) {
        console.error("Get daily report error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * GET /reports/monthly
 * Get monthly report for current month
 */
router.get("/monthly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const report = yield ReportService.getMonthlyReport(userId);
        return res.status(200).json(report);
    }
    catch (error) {
        console.error("Get monthly report error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * GET /reports/performance?from=2025-01-01&to=2025-11-24
 * Get performance report for custom date range
 */
router.get("/performance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const from = req.query.from;
        const to = req.query.to;
        const report = yield ReportService.getPerformanceReport(userId, from, to);
        return res.status(200).json(report);
    }
    catch (error) {
        console.error("Get performance report error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * GET /reports/snapshots?limit=30
 * Get historical snapshots
 */
router.get("/snapshots", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const limit = parseInt(req.query.limit || "30", 10);
        const snapshots = yield ReportService.getUserSnapshots(userId, limit);
        return res.status(200).json({
            snapshots,
        });
    }
    catch (error) {
        console.error("Get snapshots error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * POST /reports/snapshot
 * Manually create a snapshot (useful for testing)
 */
router.post("/snapshot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const snapshot = yield ReportService.createSnapshot(userId);
        return res.status(201).json({
            message: "Snapshot created successfully",
            snapshot,
        });
    }
    catch (error) {
        console.error("Create snapshot error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
exports.default = router;
