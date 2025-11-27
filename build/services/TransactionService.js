"use strict";
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
exports.createTransaction = createTransaction;
exports.getUserTransactions = getUserTransactions;
exports.getRecentTransactions = getRecentTransactions;
exports.getTransactionSummary = getTransactionSummary;
exports.getTransactionById = getTransactionById;
exports.deleteTransaction = deleteTransaction;
const database_1 = require("../config/database");
const Transaction_1 = require("../entities/Transaction");
const Asset_1 = require("../entities/Asset");
const errors_1 = require("../common/errors");
const transactionRepository = database_1.AppDataSource.getRepository(Transaction_1.Transaction);
const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
/**
 * Create a new transaction
 */
function createTransaction(userId, assetId, type, quantity, price, note) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verify asset exists
        const asset = yield assetRepository.findOne({ where: { id: assetId } });
        if (!asset) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.ASSET_NOT_FOUND, "Asset not found");
        }
        const totalValue = quantity * price;
        const transaction = transactionRepository.create({
            userId,
            assetId,
            type,
            quantity,
            price,
            totalValue,
            note,
        });
        yield transactionRepository.save(transaction);
        return transaction;
    });
}
/**
 * Get all transactions for a user
 */
function getUserTransactions(userId, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = transactionRepository.createQueryBuilder("transaction").leftJoinAndSelect("transaction.asset", "asset").where("transaction.userId = :userId", { userId });
        if (filters === null || filters === void 0 ? void 0 : filters.type) {
            query.andWhere("transaction.type = :type", { type: filters.type });
        }
        if (filters === null || filters === void 0 ? void 0 : filters.assetId) {
            query.andWhere("transaction.assetId = :assetId", { assetId: filters.assetId });
        }
        query.orderBy("transaction.createdAt", "DESC");
        if (filters === null || filters === void 0 ? void 0 : filters.limit) {
            query.take(filters.limit);
        }
        if (filters === null || filters === void 0 ? void 0 : filters.offset) {
            query.skip(filters.offset);
        }
        const transactions = yield query.getMany();
        return transactions.map((t) => ({
            id: t.id,
            type: t.type,
            asset: {
                id: t.asset.id,
                symbol: t.asset.symbol,
                name: t.asset.name,
                imageUrl: t.asset.imageUrl,
            },
            quantity: Number(t.quantity),
            price: Number(t.price),
            totalValue: Number(t.totalValue),
            note: t.note,
            createdAt: t.createdAt,
        }));
    });
}
/**
 * Get recent transactions (last 10 by default)
 */
function getRecentTransactions(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, limit = 10) {
        return getUserTransactions(userId, { limit });
    });
}
/**
 * Get transaction summary (total spent, total received)
 */
function getTransactionSummary(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = yield transactionRepository.find({
            where: { userId },
        });
        let totalSpent = 0;
        let totalReceived = 0;
        let buyCount = 0;
        let sellCount = 0;
        transactions.forEach((t) => {
            const value = Number(t.totalValue);
            if (t.type === "buy") {
                totalSpent += value;
                buyCount++;
            }
            else {
                totalReceived += value;
                sellCount++;
            }
        });
        const netProfit = totalReceived - totalSpent;
        return {
            totalSpent,
            totalReceived,
            netProfit,
            totalTransactions: transactions.length,
            buyCount,
            sellCount,
        };
    });
}
/**
 * Get single transaction by ID
 */
function getTransactionById(userId, transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield transactionRepository.findOne({
            where: { id: transactionId, userId },
            relations: ["asset"],
        });
        if (!transaction) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.TRANSACTION_NOT_FOUND, "Transaction not found");
        }
        return {
            id: transaction.id,
            type: transaction.type,
            asset: {
                id: transaction.asset.id,
                symbol: transaction.asset.symbol,
                name: transaction.asset.name,
                imageUrl: transaction.asset.imageUrl,
            },
            quantity: Number(transaction.quantity),
            price: Number(transaction.price),
            totalValue: Number(transaction.totalValue),
            note: transaction.note,
            createdAt: transaction.createdAt,
        };
    });
}
/**
 * Delete transaction
 */
function deleteTransaction(userId, transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield transactionRepository.findOne({
            where: { id: transactionId, userId },
        });
        if (!transaction) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.TRANSACTION_NOT_FOUND, "Transaction not found");
        }
        yield transactionRepository.remove(transaction);
        return { message: "Transaction deleted successfully" };
    });
}
exports.default = {
    createTransaction,
    getUserTransactions,
    getRecentTransactions,
    getTransactionSummary,
    getTransactionById,
    deleteTransaction,
};
