import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pool } from "./database";
import authRoutes from "./routes/auth.routes";
import doctoresRoutes from "./routes/doctores.routes";
import pacientesRoutes from "./routes/pacientes.routes";
import citasRoutes from "./routes/citas";

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
console.log("✅ ENCRYPTION_SECRET length:", process.env.ENCRYPTION_SECRET?.length || "❌ Not Loaded");

// 🚀 Configuración del servidor
const PORT = process.env.PORT || 3000;
const app = express();

// 🔒 Seguridad
app.use(helmet());

// 🔒 Rate Limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
}));


app.use(cors({
  origin: 'https://consultorio6-lxjeutp28-kato-citys-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// 🔥 Muy importante para manejar el preflight de CORS
app.options('*', cors({
  origin: 'https://consultorio6-lxjeutp28-kato-citys-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


app.use(express.json());


// 🚀 Parseo JSON
app.use(express.json());

// ✅ Rutas principales
app.use("/auth", authRoutes);
app.use("/doctores", doctoresRoutes);
app.use("/pacientes", pacientesRoutes);
app.use("/api", citasRoutes);

// ✅ Ruta raíz
app.get("/", (req: Request, res: Response) => {
  res.json({ message: `🚀 Backend activo en ${isProduction ? "Render" : "Local"}` });
});

// ✅ Check DB
app.get("/check-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW();");
    res.json({ message: "✅ Conexión exitosa a la base de datos", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en la conexión a la base de datos:", error);
    res.status(500).json({ message: "Error al conectar con la base de datos", error });
  }
});

// 🛑 Manejo global de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error detectado:", err.message);
  res.status(500).json({ message: "Error interno del servidor" });
});

// 🔥 Iniciar servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);

  try {
    await pool.query("SELECT NOW();");
    console.log(`✅ Conectado a la base de datos PostgreSQL (${isProduction ? "Producción" : "Local"})`);
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
  }
}).on("error", (err) => {
  console.error("❌ Error al iniciar el servidor:", err);
  process.exit(1);
});
