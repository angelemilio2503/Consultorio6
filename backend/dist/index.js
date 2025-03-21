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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const doctores_routes_1 = __importDefault(require("./routes/doctores.routes"));
const pacientes_routes_1 = __importDefault(require("./routes/pacientes.routes"));
const citas_1 = __importDefault(require("./routes/citas"));
dotenv.config(); // Cargar variables .env
const isProduction = process.env.NODE_ENV === "production";
// ✅ Validar variables esenciales
const requiredEnvVars = [
    "JWT_SECRET",
    "ENCRYPTION_SECRET",
    isProduction ? "PROD_DB_HOST" : "LOCAL_DB_HOST",
];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Faltan variables de entorno: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}
console.log(`✅ Entorno: ${isProduction ? "Producción (Render)" : "Desarrollo (Local)"}`);
console.log("✅ JWT_SECRET cargado:", process.env.JWT_SECRET ? "✔️ Loaded" : "❌ Not Loaded");
console.log("✅ ENCRYPTION_SECRET length:", ((_a = process.env.ENCRYPTION_SECRET) === null || _a === void 0 ? void 0 : _a.length) || "❌ Not Loaded");
// 🚀 Configuración del servidor
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// 🔒 Seguridad
app.use((0, helmet_1.default)());
// 🔒 Rate Limit
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
}));
// ✅ CORS dinámico
const allowedOrigins = [
    "https://consultorio6-9bn5-5dqiwlto9-kato-citys-projects.vercel.app",
    "https://consultorio6-mega-kato-citys-projects.vercel.app",
    "https://denuevo123.vercel.app",
    "https://consultorio6-lxjeutp28-kato-citys-projects.vercel.app",
    "http://localhost:5173",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("🚫 Origin NO autorizado:", origin);
            callback(new Error("🚫 No autorizado por CORS"));
        }
    },
    credentials: true,
}));
// 🚀 Parseo JSON
app.use(express_1.default.json());
// ✅ Rutas principales
app.use("/auth", auth_routes_1.default);
app.use("/doctores", doctores_routes_1.default);
app.use("/pacientes", pacientes_routes_1.default);
app.use("/api", citas_1.default);
// ✅ Ruta raíz
app.get("/", (req, res) => {
    res.json({ message: `🚀 Backend activo en ${isProduction ? "Render" : "Local"}` });
});
// ✅ Check DB
app.get("/check-db", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT NOW();");
        res.json({ message: "✅ Conexión exitosa a la base de datos", time: result.rows[0] });
    }
    catch (error) {
        console.error("❌ Error en la conexión a la base de datos:", error);
        res.status(500).json({ message: "Error al conectar con la base de datos", error });
    }
}));
// 🛑 Manejo global de errores
app.use((err, req, res, next) => {
    console.error("🔥 Error detectado:", err.message);
    res.status(500).json({ message: "Error interno del servidor" });
});
// 🔥 Iniciar servidor
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    try {
        yield database_1.pool.query("SELECT NOW();");
        console.log(`✅ Conectado a la base de datos PostgreSQL (${isProduction ? "Producción" : "Local"})`);
    }
    catch (error) {
        console.error("❌ No se pudo conectar a la base de datos:", error);
    }
})).on("error", (err) => {
    console.error("❌ Error al iniciar el servidor:", err);
    process.exit(1);
});
