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
exports.initSnapshotCronJob = initSnapshotCronJob;
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const ReportService = __importStar(require("../services/ReportService"));
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
/**
 * Cron job to create daily snapshots for all users
 * Runs every day at 00:01 (1 minute after midnight)
 */
function initSnapshotCronJob() {
    // Schedule: At 00:01 every day
    node_cron_1.default.schedule("1 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
        console.log("[CRON] Starting daily snapshot creation...");
        try {
            // Get all users
            const users = yield userRepository.find();
            let successCount = 0;
            let errorCount = 0;
            // Create snapshot for each user
            for (const user of users) {
                try {
                    yield ReportService.createSnapshot(user.id);
                    successCount++;
                }
                catch (error) {
                    console.error(`[CRON] Failed to create snapshot for user ${user.id}:`, error.message);
                    errorCount++;
                }
            }
            console.log(`[CRON] Daily snapshot creation completed. Success: ${successCount}, Errors: ${errorCount}`);
        }
        catch (error) {
            console.error("[CRON] Fatal error during snapshot creation:", error.message);
        }
    }));
    console.log("✓ Daily snapshot cron job initialized (runs at 00:01 every day)");
}
exports.default = { initSnapshotCronJob };
