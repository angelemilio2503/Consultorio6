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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const doctores_routes_1 = __importDefault(require("./routes/doctores.routes"));
const citas_1 = __importDefault(require("./routes/citas"));
const pacientes_routes_1 = __importDefault(require("./routes/pacientes.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Cargar variables de entorno
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ✅ Configurar CORS correctamente
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Agrega ambos orígenes si el frontend cambia de puerto
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Asegura que se permitan los headers correctos
    credentials: true, // Permitir cookies si se usan
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json()); // Permite recibir datos en formato JSON
// ✅ Ruta de prueba para asegurar que el servidor funciona
app.get("/", (req, res) => {
    res.send("🚀 Servidor del sistema de consultorio funcionando correctamente.");
});
// ✅ Rutas de la API
app.use("/api/doctores", doctores_routes_1.default);
app.use("/api/citas", citas_1.default);
app.use("/api/pacientes", pacientes_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
// ✅ Conexión a la base de datos
database_1.pool
    .connect()
    .then(() => {
    console.log("✅ Conexión exitosa a PostgreSQL");
})
    .catch((err) => {
    console.error("❌ Error al conectar con PostgreSQL:", err);
});
// ✅ Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Error interno del servidor" });
});
// ✅ Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
