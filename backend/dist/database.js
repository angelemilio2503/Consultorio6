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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
exports.pool = new pg_1.Pool({
    user: isProduction ? process.env.PROD_DB_USER : process.env.LOCAL_DB_USER,
    host: isProduction ? process.env.PROD_DB_HOST : process.env.LOCAL_DB_HOST,
    database: isProduction ? process.env.PROD_DB_NAME : process.env.LOCAL_DB_NAME,
    password: isProduction ? process.env.PROD_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
    port: Number(isProduction ? process.env.PROD_DB_PORT : process.env.LOCAL_DB_PORT) || 5432,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    keepAlive: true, // ✅ Importante para evitar desconexiones
});
exports.pool.connect()
    .then(() => console.log(`✅ Conectado a PostgreSQL (${isProduction ? "Producción (Render)" : "Local"})`))
    .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err));
