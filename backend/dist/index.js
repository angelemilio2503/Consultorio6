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
const database_1 = require("./database"); // ✅ Importar conexión a PostgreSQL
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const doctores_routes_1 = __importDefault(require("./routes/doctores.routes"));
const pacientes_routes_1 = __importDefault(require("./routes/pacientes.routes"));
const citas_1 = __importDefault(require("./routes/citas"));
dotenv.config(); // Cargar variables de entorno
// ✅ Verificación de variables de entorno esenciales
const requiredEnvVars = ["JWT_SECRET", "ENCRYPTION_SECRET", "DATABASE_URL"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Error: Faltan variables de entorno requeridas: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}
console.log("✅ JWT_SECRET loaded:", process.env.JWT_SECRET ? "✔️ Loaded" : "❌ Not Loaded");
console.log("✅ ENCRYPTION_SECRET length:", ((_a = process.env.ENCRYPTION_SECRET) === null || _a === void 0 ? void 0 : _a.length) || "❌ Not Loaded");
// 🚀 Configuración del servidor
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// 🔒 Configuración de seguridad con Helmet
app.use((0, helmet_1.default)());
// 🔒 Configuración de rate limit para evitar ataques de fuerza bruta
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por IP
    message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
}));
// ✅ Configuración de CORS con múltiples orígenes permitidos
const allowedOrigins = [
    "https://consultorio6-mega.vercel.app", // URL de tu frontend en Vercel
    "http://localhost:5173" // Para desarrollo local
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("🚫 No autorizado por CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
// 🚀 Habilitar el parsing de JSON
app.use(express_1.default.json());
// 📌 Definición de rutas
app.use("/auth", auth_routes_1.default);
app.use("/doctores", doctores_routes_1.default);
app.use("/pacientes", pacientes_routes_1.default);
app.use("/api", citas_1.default);
// ✅ Nueva ruta raíz para probar si el backend responde correctamente
app.get("/", (req, res) => {
    res.json({ message: "🚀 Backend funcionando correctamente en Render" });
});
// ✅ Ruta de prueba para verificar conexión a la base de datos
app.get("/check-db", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT NOW();"); // Prueba simple a PostgreSQL
        res.json({ message: "✅ Conexión exitosa a la base de datos", time: result.rows[0] });
    }
    catch (error) {
        console.error("❌ Error en la conexión a la base de datos:", error);
        res.status(500).json({ message: "Error al conectar con la base de datos", error });
    }
}));
// 🛑 Middleware global para manejo de errores
app.use((err, req, res, next) => {
    console.error("🔥 Error detectado:", err.message);
    res.status(500).json({ message: "Error interno del servidor" });
});
// 🔥 Iniciar servidor
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    // ✅ Verificar conexión con la base de datos al iniciar
    try {
        yield database_1.pool.query("SELECT NOW();");
        console.log("✅ Conectado a la base de datos PostgreSQL en Render");
    }
    catch (error) {
        console.error("❌ No se pudo conectar a la base de datos:", error);
    }
})).on("error", (err) => {
    console.error("❌ Error al iniciar el servidor:", err);
    process.exit(1);
});
