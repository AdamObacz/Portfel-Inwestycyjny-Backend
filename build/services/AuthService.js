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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
class AuthService {
    static register(email, password, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = yield userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("User with this email already exists");
            }
            // Hash password
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // Create new user
            const user = userRepository.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                isVerified: false,
            });
            yield userRepository.save(user);
            return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user
            const user = yield userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            // Verify password
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            };
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userRepository.findOne({ where: { id } });
        });
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
