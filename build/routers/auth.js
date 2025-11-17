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
const hyper_express_1 = __importDefault(require("hyper-express"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const router = new hyper_express_1.default.Router();
// Middleware to check if user is authenticated
function requireAuth(req) {
    if (!req.session || !req.session.userId) {
        return false;
    }
    return true;
}
// POST /auth/register
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = yield AuthService_1.default.register(email, password, firstName, lastName);
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
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = yield AuthService_1.default.login(email, password);
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
        const user = yield AuthService_1.default.getUserById(userId);
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
