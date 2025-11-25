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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCryptoAssets = searchCryptoAssets;
exports.getOrCreateAsset = getOrCreateAsset;
exports.getCurrentPrice = getCurrentPrice;
exports.getCurrentPrices = getCurrentPrices;
exports.getAssetById = getAssetById;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../config/database");
const Asset_1 = require("../entities/Asset");
const errors_1 = require("../common/errors");
const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
// Using CoinGecko API (free tier)
const COINGECKO_API_URL = process.env.CRYPTO_API_URL || "https://api.coingecko.com/api/v3";
const API_KEY = process.env.CRYPTO_API_KEY || ""; // Optional for free tier
/**
 * Search for cryptocurrencies by name or symbol
 */
function searchCryptoAssets(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${COINGECKO_API_URL}/search`, {
                params: { query },
                headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {},
            });
            const coins = response.data.coins.slice(0, 10); // Limit to 10 results
            // Map to our Asset structure
            const assets = coins.map((coin) => ({
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                type: "cryptocurrency",
                apiId: coin.id,
                imageUrl: coin.thumb,
            }));
            return assets;
        }
        catch (error) {
            console.error("CoinGecko search error:", error.message);
            throw new errors_1.CustomError(errors_1.ErrorCodes.INTERNAL_ERROR, errors_1.ErrorKeys.EXTERNAL_API_ERROR, "Failed to search cryptocurrencies");
        }
    });
}
/**
 * Get or create asset in database
 */
function getOrCreateAsset(symbol, name, apiId, imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let asset = yield assetRepository.findOne({ where: { symbol } });
        if (!asset) {
            asset = assetRepository.create({
                symbol,
                name,
                type: "cryptocurrency",
                apiId,
                imageUrl,
            });
            yield assetRepository.save(asset);
        }
        return asset;
    });
}
/**
 * Get current price for a single asset
 */
function getCurrentPrice(apiId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${COINGECKO_API_URL}/simple/price`, {
                params: {
                    ids: apiId,
                    vs_currencies: "usd",
                },
                headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {},
            });
            const priceData = response.data;
            if (!priceData[apiId]) {
                throw new Error("Price data not found");
            }
            return priceData[apiId].usd;
        }
        catch (error) {
            console.error("CoinGecko price fetch error:", error.message);
            throw new errors_1.CustomError(errors_1.ErrorCodes.INTERNAL_ERROR, errors_1.ErrorKeys.EXTERNAL_API_ERROR, "Failed to fetch current price");
        }
    });
}
/**
 * Get current prices for multiple assets
 */
function getCurrentPrices(apiIds) {
    return __awaiter(this, void 0, void 0, function* () {
        if (apiIds.length === 0) {
            return {};
        }
        try {
            const response = yield axios_1.default.get(`${COINGECKO_API_URL}/simple/price`, {
                params: {
                    ids: apiIds.join(","),
                    vs_currencies: "usd",
                },
                headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {},
            });
            const priceData = response.data;
            const prices = {};
            for (const apiId of apiIds) {
                if (priceData[apiId]) {
                    prices[apiId] = priceData[apiId].usd;
                }
            }
            return prices;
        }
        catch (error) {
            console.error("CoinGecko bulk price fetch error:", error.message);
            throw new errors_1.CustomError(errors_1.ErrorCodes.INTERNAL_ERROR, errors_1.ErrorKeys.EXTERNAL_API_ERROR, "Failed to fetch current prices");
        }
    });
}
/**
 * Get asset by ID from database
 */
function getAssetById(assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const asset = yield assetRepository.findOne({ where: { id: assetId } });
        if (!asset) {
            throw new errors_1.CustomError(errors_1.ErrorCodes.NOT_FOUND, errors_1.ErrorKeys.ASSET_NOT_FOUND, "Asset not found");
        }
        return asset;
    });
}
exports.default = {
    searchCryptoAssets,
    getOrCreateAsset,
    getCurrentPrice,
    getCurrentPrices,
    getAssetById,
};
