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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSnapshot = createSnapshot;
exports.getDailyReport = getDailyReport;
exports.getMonthlyReport = getMonthlyReport;
exports.getPerformanceReport = getPerformanceReport;
exports.getUserSnapshots = getUserSnapshots;
const database_1 = require("../config/database");
const PortfolioSnapshot_1 = require("../entities/PortfolioSnapshot");
const errors_1 = require("../common/errors");
const PortfolioService = __importStar(require("./PortfolioService"));
const typeorm_1 = require("typeorm");
const snapshotRepository = database_1.AppDataSource.getRepository(PortfolioSnapshot_1.PortfolioSnapshot);
/**
 * Create a snapshot of user's portfolio
 */
function createSnapshot(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const portfolioData = yield PortfolioService.getUserPortfolio(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Check if snapshot already exists for today
        const existingSnapshot = yield snapshotRepository.findOne({
            where: {
                userId,
                snapshotDate: today,
            },
        });
        if (existingSnapshot) {
            // Update existing snapshot
            existingSnapshot.totalValue = portfolioData.totalValue;
            existingSnapshot.breakdown = portfolioData.positions.map((p) => ({
                assetId: p.asset.id,
                symbol: p.asset.symbol,
                quantity: p.quantity,
                currentPrice: p.currentPrice,
                value: p.currentValue,
            }));
            yield snapshotRepository.save(existingSnapshot);
            return existingSnapshot;
        }
        // Create new snapshot
        const snapshot = snapshotRepository.create({
            userId,
            snapshotDate: today,
            totalValue: portfolioData.totalValue,
            breakdown: portfolioData.positions.map((p) => ({
                assetId: p.asset.id,
                symbol: p.asset.symbol,
                quantity: p.quantity,
                currentPrice: p.currentPrice,
                value: p.currentValue,
            })),
        });
        yield snapshotRepository.save(snapshot);
        return snapshot;
    });
}
/**
 * Get daily report (today vs yesterday)
 */
function getDailyReport(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const [todaySnapshot, yesterdaySnapshot] = yield Promise.all([
            snapshotRepository.findOne({
                where: { userId, snapshotDate: today },
            }),
            snapshotRepository.findOne({
                where: { userId, snapshotDate: yesterday },
            }),
        ]);
        // Get current portfolio data
        const currentPortfolio = yield PortfolioService.getUserPortfolio(userId);
        const currentValue = currentPortfolio.totalValue;
        const previousValue = yesterdaySnapshot ? Number(yesterdaySnapshot.totalValue) : currentValue;
        const dailyChange = currentValue - previousValue;
        const dailyChangePercentage = previousValue > 0 ? (dailyChange / previousValue) * 100 : 0;
        return {
            date: today,
            currentValue,
            previousValue,
            dailyChange,
            dailyChangePercentage,
            positions: currentPortfolio.positions,
        };
    });
}
/**
 * Get monthly report
 */
function getMonthlyReport(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const snapshots = yield snapshotRepository.find({
            where: {
                userId,
                snapshotDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth),
            },
            order: {
                snapshotDate: "ASC",
            },
        });
        if (snapshots.length === 0) {
            const currentPortfolio = yield PortfolioService.getUserPortfolio(userId);
            return {
                month: today.getMonth() + 1,
                year: today.getFullYear(),
                startValue: currentPortfolio.totalValue,
                endValue: currentPortfolio.totalValue,
                monthlyChange: 0,
                monthlyChangePercentage: 0,
                snapshots: [],
            };
        }
        const startValue = Number(snapshots[0].totalValue);
        const endValue = Number(snapshots[snapshots.length - 1].totalValue);
        const monthlyChange = endValue - startValue;
        const monthlyChangePercentage = startValue > 0 ? (monthlyChange / startValue) * 100 : 0;
        return {
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            startValue,
            endValue,
            monthlyChange,
            monthlyChangePercentage,
            snapshots: snapshots.map((s) => ({
                date: s.snapshotDate,
                value: Number(s.totalValue),
                breakdown: s.breakdown,
            })),
        };
    });
}
/**
 * Get performance report for a custom date range
 */
function getPerformanceReport(userId, fromDate, toDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const from = fromDate ? new Date(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
        const to = toDate ? new Date(toDate) : new Date();
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        const snapshots = yield snapshotRepository.find({
            where: {
                userId,
                snapshotDate: (0, typeorm_1.Between)(from, to),
            },
            order: {
                snapshotDate: "ASC",
            },
        });
        if (snapshots.length < 2) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.BAD_REQUEST, errors_1.ErrorKeys.INSUFFICIENT_DATA, "Not enough data for the selected period. Need at least 2 snapshots.");
        }
        const startValue = Number(snapshots[0].totalValue);
        const endValue = Number(snapshots[snapshots.length - 1].totalValue);
        const totalChange = endValue - startValue;
        const totalChangePercentage = startValue > 0 ? (totalChange / startValue) * 100 : 0;
        // Calculate daily changes
        const dailyChanges = [];
        for (let i = 1; i < snapshots.length; i++) {
            const prevValue = Number(snapshots[i - 1].totalValue);
            const currValue = Number(snapshots[i].totalValue);
            const change = currValue - prevValue;
            const changePercentage = prevValue > 0 ? (change / prevValue) * 100 : 0;
            dailyChanges.push({
                date: snapshots[i].snapshotDate,
                value: currValue,
                change,
                changePercentage,
            });
        }
        return {
            period: {
                from,
                to,
            },
            startValue,
            endValue,
            totalChange,
            totalChangePercentage,
            snapshots: snapshots.map((s) => ({
                date: s.snapshotDate,
                value: Number(s.totalValue),
            })),
            dailyChanges,
        };
    });
}
/**
 * Get all snapshots for a user
 */
function getUserSnapshots(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, limit = 30) {
        const snapshots = yield snapshotRepository.find({
            where: { userId },
            order: {
                snapshotDate: "DESC",
            },
            take: limit,
        });
        return snapshots.map((s) => ({
            date: s.snapshotDate,
            value: Number(s.totalValue),
            breakdown: s.breakdown,
        }));
    });
}
exports.default = {
    createSnapshot,
    getDailyReport,
    getMonthlyReport,
    getPerformanceReport,
    getUserSnapshots,
};
