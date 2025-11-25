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
const AuthService = __importStar(require("../services/AuthService"));
const validate_1 = require("../middlewares/validate");
const auth_dto_1 = require("../dto/auth.dto");
const router = new hyper_express_1.default.Router();
// Middleware to check if user is authenticated
function requireAuth(req) {
    if (!req.session || !req.session.userId) {
        return false;
    }
    return true;
}
// POST /auth/register
router.post("/register", (0, validate_1.validate)({ body: auth_dto_1.registerSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName } = req.locals.validatedData;
        const user = yield AuthService.register(email, password, firstName, lastName);
        // Set session
        if (req.session) {
            req.session.userId = user.id;
            yield new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        console.error("Register error:", error.message);
        return res.status(400).json({ error: error.message });
    }
}));
// POST /auth/login
router.post("/login", (0, validate_1.validate)({ body: auth_dto_1.loginSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.locals.validatedData;
        const user = yield AuthService.login(email, password);
        // Set session
        if (req.session) {
            req.session.userId = user.id;
            yield new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
        return res.status(200).json({
            message: "Logged in successfully",
            user,
        });
    }
    catch (error) {
        console.error("Login error:", error.message);
        return res.status(401).json({ error: error.message });
    }
}));
// GET /auth/me - Get current user
router.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!requireAuth(req)) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const userId = req.session.userId;
        const user = yield AuthService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Get current user error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
// POST /auth/logout
router.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to logout" });
            }
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }
    else {
        return res.status(400).json({ error: "No session to destroy" });
    }
});
exports.default = router;
