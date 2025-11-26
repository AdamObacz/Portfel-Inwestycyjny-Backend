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
exports.addToPortfolio = addToPortfolio;
exports.getUserPortfolio = getUserPortfolio;
exports.updatePosition = updatePosition;
exports.removeFromPortfolio = removeFromPortfolio;
exports.getPositionById = getPositionById;
const database_1 = require("../config/database");
const Portfolio_1 = require("../entities/Portfolio");
const errors_1 = require("../common/errors");
const CryptoApiService = __importStar(require("./CryptoApiService"));
const TransactionService = __importStar(require("./TransactionService"));
const portfolioRepository = database_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
/**
 * Add asset to user's portfolio
 */
function addToPortfolio(userId_1, assetId_1, quantity_1, purchasePrice_1) {
    return __awaiter(this, arguments, void 0, function* (userId, assetId, quantity, purchasePrice, createTransaction = true) {
        // Verify asset exists
        const asset = yield CryptoApiService.getAssetById(assetId);
        // Check if position already exists
        const existingPosition = yield portfolioRepository.findOne({
            where: { userId, assetId },
        });
        if (existingPosition) {
            // Update existing position - calculate new average price
            const totalQuantity = Number(existingPosition.quantity) + quantity;
            const totalCost = Number(existingPosition.quantity) * Number(existingPosition.averagePurchasePrice) + quantity * purchasePrice;
            const newAveragePrice = totalCost / totalQuantity;
            existingPosition.quantity = totalQuantity;
            existingPosition.averagePurchasePrice = newAveragePrice;
            yield portfolioRepository.save(existingPosition);
            // Create transaction record
            if (createTransaction) {
                yield TransactionService.createTransaction(userId, assetId, "buy", quantity, purchasePrice, "Added to portfolio");
            }
            return existingPosition;
        }
        // Create new position
        const position = portfolioRepository.create({
            userId,
            assetId,
            quantity,
            averagePurchasePrice: purchasePrice,
        });
        yield portfolioRepository.save(position);
        // Create transaction record
        if (createTransaction) {
            yield TransactionService.createTransaction(userId, assetId, "buy", quantity, purchasePrice, "Added to portfolio");
        }
        return position;
    });
}
/**
 * Get user's entire portfolio with current prices
 */
function getUserPortfolio(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const positions = yield portfolioRepository.find({
            where: { userId },
            relations: ["asset"],
        });
        if (positions.length === 0) {
            return {
                positions: [],
                totalValue: 0,
                totalCost: 0,
                totalProfitLoss: 0,
                totalProfitLossPercentage: 0,
            };
        }
        // Get current prices for all assets
        const apiIds = positions.map((p) => p.asset.apiId);
        const currentPrices = yield CryptoApiService.getCurrentPrices(apiIds);
        // Calculate values
        let totalValue = 0;
        let totalCost = 0;
        const enrichedPositions = positions.map((position) => {
            const currentPrice = currentPrices[position.asset.apiId] || 0;
            const quantity = Number(position.quantity);
            const avgPrice = Number(position.averagePurchasePrice);
            const currentValue = quantity * currentPrice;
            const costBasis = quantity * avgPrice;
            const profitLoss = currentValue - costBasis;
            const profitLossPercentage = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
            totalValue += currentValue;
            totalCost += costBasis;
            return {
                id: position.id,
                asset: {
                    id: position.asset.id,
                    symbol: position.asset.symbol,
                    name: position.asset.name,
                    imageUrl: position.asset.imageUrl,
                },
                quantity,
                averagePurchasePrice: avgPrice,
                currentPrice,
                currentValue,
                costBasis,
                profitLoss,
                profitLossPercentage,
                updatedAt: position.updatedAt,
            };
        });
        const totalProfitLoss = totalValue - totalCost;
        const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
        return {
            positions: enrichedPositions,
            totalValue,
            totalCost,
            totalProfitLoss,
            totalProfitLossPercentage,
        };
    });
}
/**
 * Update portfolio position
 */
function updatePosition(userId, positionId, quantity, purchasePrice) {
    return __awaiter(this, void 0, void 0, function* () {
        const position = yield portfolioRepository.findOne({
            where: { id: positionId, userId },
        });
        if (!position) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.PORTFOLIO_POSITION_NOT_FOUND, "Portfolio position not found");
        }
        if (quantity !== undefined) {
            position.quantity = quantity;
        }
        if (purchasePrice !== undefined) {
            position.averagePurchasePrice = purchasePrice;
        }
        yield portfolioRepository.save(position);
        return position;
    });
}
/**
 * Remove asset from portfolio
 */
function removeFromPortfolio(userId_1, positionId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, positionId, createTransaction = true) {
        const position = yield portfolioRepository.findOne({
            where: { id: positionId, userId },
            relations: ["asset"],
        });
        if (!position) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.PORTFOLIO_POSITION_NOT_FOUND, "Portfolio position not found");
        }
        // Get current price for transaction record
        if (createTransaction) {
            const currentPrices = yield CryptoApiService.getCurrentPrices([position.asset.apiId]);
            const currentPrice = currentPrices[position.asset.apiId] || 0;
            yield TransactionService.createTransaction(userId, position.assetId, "sell", Number(position.quantity), currentPrice, "Removed from portfolio");
        }
        yield portfolioRepository.remove(position);
        return { message: "Position removed successfully" };
    });
}
/**
 * Get single position by ID
 */
function getPositionById(userId, positionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const position = yield portfolioRepository.findOne({
            where: { id: positionId, userId },
            relations: ["asset"],
        });
        if (!position) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.PORTFOLIO_POSITION_NOT_FOUND, "Portfolio position not found");
        }
        return position;
    });
}
exports.default = {
    addToPortfolio,
    getUserPortfolio,
    updatePosition,
    removeFromPortfolio,
    getPositionById,
};
