import { AppDataSource } from "../config/database";
import { Transaction } from "../entities/Transaction";
import { Asset } from "../entities/Asset";
import { CustomError, ErrorCodes, ErrorKeys } from "../common/errors";
import * as CryptoApiService from "./CryptoApiService";

const transactionRepository = AppDataSource.getRepository(Transaction);
const assetRepository = AppDataSource.getRepository(Asset);

/**
 * Create a new transaction
 */
export async function createTransaction(userId: string, assetId: string, type: "buy" | "sell", quantity: number, price: number, note?: string) {
  // Verify asset exists
  const asset = await assetRepository.findOne({ where: { id: assetId } });
  if (!asset) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.ASSET_NOT_FOUND, "Asset not found");
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

  await transactionRepository.save(transaction);
  return transaction;
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(
  userId: string,
  filters?: {
    type?: "buy" | "sell";
    assetId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const query = transactionRepository.createQueryBuilder("transaction").leftJoinAndSelect("transaction.asset", "asset").where("transaction.userId = :userId", { userId });

  if (filters?.type) {
    query.andWhere("transaction.type = :type", { type: filters.type });
  }

  if (filters?.assetId) {
    query.andWhere("transaction.assetId = :assetId", { assetId: filters.assetId });
  }

  query.orderBy("transaction.createdAt", "DESC");

  if (filters?.limit) {
    query.take(filters.limit);
  }

  if (filters?.offset) {
    query.skip(filters.offset);
  }

  const transactions = await query.getMany();

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
}

/**
 * Get recent transactions (last 10 by default)
 */
export async function getRecentTransactions(userId: string, limit: number = 10) {
  return getUserTransactions(userId, { limit });
}

/**
 * Get transaction summary (total spent, total received)
 */
export async function getTransactionSummary(userId: string) {
  const transactions = await transactionRepository.find({
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
    } else {
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
}

/**
 * Get single transaction by ID
 */
export async function getTransactionById(userId: string, transactionId: string) {
  const transaction = await transactionRepository.findOne({
    where: { id: transactionId, userId },
    relations: ["asset"],
  });

  if (!transaction) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.TRANSACTION_NOT_FOUND, "Transaction not found");
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
}

/**
 * Delete transaction
 */
export async function deleteTransaction(userId: string, transactionId: string) {
  const transaction = await transactionRepository.findOne({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.TRANSACTION_NOT_FOUND, "Transaction not found");
  }

  await transactionRepository.remove(transaction);
  return { message: "Transaction deleted successfully" };
}

export default {
  createTransaction,
  getUserTransactions,
  getRecentTransactions,
  getTransactionSummary,
  getTransactionById,
  deleteTransaction,
};
