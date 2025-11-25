"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "portfolio_db",
    synchronize: process.env.NODE_ENV === "development",
    logging: false,
    entities: process.env.NODE_ENV === "production" ? ["build/entities/*.js"] : ["src/entities/*.ts"],
    migrations: process.env.NODE_ENV === "production" ? ["build/migrations/*.js"] : ["src/migrations/*.ts"],
    subscribers: [],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("✓ Database connected");
})
    .catch((error) => {
    console.error("✗ Database error:", error);
});
exports.default = exports.AppDataSource;
