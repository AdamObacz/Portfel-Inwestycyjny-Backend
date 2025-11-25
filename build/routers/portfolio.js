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
const PortfolioService = __importStar(require("../services/PortfolioService"));
const CryptoApiService = __importStar(require("../services/CryptoApiService"));
const validate_1 = require("../middlewares/validate");
const portfolio_dto_1 = require("../dto/portfolio.dto");
const requireAuth_1 = require("../middlewares/requireAuth");
const router = new hyper_express_1.default.Router();
// All routes require authentication
router.use(requireAuth_1.requireAuth);
/**
 * GET /portfolio
 * Get user's entire portfolio with current values
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const portfolio = yield PortfolioService.getUserPortfolio(userId);
        return res.status(200).json(portfolio);
    }
    catch (error) {
        console.error("Get portfolio error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * POST /portfolio
 * Add asset to portfolio
 */
router.post("/", (0, validate_1.validate)({ body: portfolio_dto_1.addToPortfolioSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const { assetId, quantity, purchasePrice } = req.locals.validatedData;
        const position = yield PortfolioService.addToPortfolio(userId, assetId, quantity, purchasePrice);
        return res.status(201).json({
            message: "Asset added to portfolio successfully",
            position,
        });
    }
    catch (error) {
        console.error("Add to portfolio error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * PUT /portfolio/:id
 * Update portfolio position
 */
router.put("/:id", (0, validate_1.validate)({ body: portfolio_dto_1.updatePortfolioSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const positionId = req.path_parameters.id;
        const { quantity, purchasePrice } = req.locals.validatedData;
        const position = yield PortfolioService.updatePosition(userId, positionId, quantity, purchasePrice);
        return res.status(200).json({
            message: "Position updated successfully",
            position,
        });
    }
    catch (error) {
        console.error("Update position error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * DELETE /portfolio/:id
 * Remove asset from portfolio
 */
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        const positionId = req.path_parameters.id;
        const result = yield PortfolioService.removeFromPortfolio(userId, positionId);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Remove from portfolio error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
/**
 * GET /portfolio/assets/search?q=bitcoin
 * Search for cryptocurrencies
 */
router.get("/assets/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q || "";
        if (!query || query.length < 1) {
            return res.status(400).json({
                error: "Search query is required",
                errorKey: "invalid_argument",
            });
        }
        const assets = yield CryptoApiService.searchCryptoAssets(query);
        return res.status(200).json({
            results: assets,
        });
    }
    catch (error) {
        console.error("Search assets error:", error.message);
        return res.status(error.statusCode || 500).json({
            error: error.message,
            errorKey: error.errorKey || "internal_server_error",
        });
    }
}));
exports.default = router;
