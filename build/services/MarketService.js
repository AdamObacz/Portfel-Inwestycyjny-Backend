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
exports.getGlobalMarketData = getGlobalMarketData;
exports.getFearGreedIndex = getFearGreedIndex;
exports.getMarketIndicators = getMarketIndicators;
const axios_1 = __importDefault(require("axios"));
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const FEAR_GREED_API = "https://api.alternative.me/fng/";
/**
 * Get global cryptocurrency market data
 */
function getGlobalMarketData() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const response = yield axios_1.default.get(`${COINGECKO_API}/global`, {
                timeout: 10000,
            });
            const data = response.data.data;
            return {
                bitcoinDominance: ((_a = data.market_cap_percentage) === null || _a === void 0 ? void 0 : _a.btc) || 0,
                totalMarketCap: ((_b = data.total_market_cap) === null || _b === void 0 ? void 0 : _b.usd) || 0,
                totalVolume24h: ((_c = data.total_volume) === null || _c === void 0 ? void 0 : _c.usd) || 0,
                marketCapChangePercentage24h: data.market_cap_change_percentage_24h_usd || 0,
            };
        }
        catch (error) {
            console.error("Error fetching global market data:", error);
            throw new Error("Failed to fetch global market data");
        }
    });
}
/**
 * Get Fear & Greed Index
 */
function getFearGreedIndex() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${FEAR_GREED_API}?limit=1`, {
                timeout: 10000,
            });
            const data = response.data.data[0];
            return {
                value: parseInt(data.value),
                classification: data.value_classification,
            };
        }
        catch (error) {
            console.error("Error fetching Fear & Greed Index:", error);
            throw new Error("Failed to fetch Fear & Greed Index");
        }
    });
}
/**
 * Get all market indicators
 */
function getMarketIndicators() {
    return __awaiter(this, void 0, void 0, function* () {
        const [marketData, fearGreed] = yield Promise.all([getGlobalMarketData(), getFearGreedIndex()]);
        return {
            bitcoinDominance: marketData.bitcoinDominance,
            totalMarketCap: marketData.totalMarketCap,
            totalVolume24h: marketData.totalVolume24h,
            marketCapChangePercentage24h: marketData.marketCapChangePercentage24h,
            fearGreedIndex: {
                value: fearGreed.value,
                classification: fearGreed.classification,
            },
        };
    });
}
exports.default = {
    getGlobalMarketData,
    getFearGreedIndex,
    getMarketIndicators,
};
