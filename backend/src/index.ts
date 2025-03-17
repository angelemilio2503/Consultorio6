import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pool } from "./database"; // ✅ Importar conexión a PostgreSQL
import authRoutes from "./routes/auth.routes";
import indexRoutes from "./routes/index";
import doctoresRoutes from "./routes/doctores.routes";
import pacientesRoutes from "./routes/pacientes.routes";
import citasRoutes from "./routes/citas";

dotenv.config(); // 🔹 Cargar variables de entorno

// 🔹 Verificación de variables de entorno esenciales
const requiredEnvVars = ["JWT_SECRET", "ENCRYPTION_SECRET", "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_PORT"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ ERROR: Faltan variables de entorno requeridas: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

console.log("✅ JWT_SECRET loaded:", process.env.JWT_SECRET ? "✔️ Loaded" : "❌ Not Loaded");
console.log("✅ ENCRYPTION_SECRET length:", process.env.ENCRYPTION_SECRET?.length || "❌ Not Loaded");

// 🚀 Configuración del servidor
const PORT = process.env.PORT || 3000;
const app = express();

// 🔒 Configuración de seguridad con Helmet
app.use(helmet());

// 🔒 Configuración de rate limit para evitar ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
});
app.use(limiter);

// ✅ Configuración de CORS con múltiples orígenes permitidos
const allowedOrigins = [
  "https://consultorio6-9bn5-5dqiwlto9-kato-citys-projects.vercel.app", // URL de Vercel
  "http://localhost:5173", // Desarrollo local
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// 🚀 Habilitar el parsing de JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Definición de rutas
app.use("/auth", authRoutes);
app.use("/doctores", doctoresRoutes);
app.use("/pacientes", pacientesRoutes);
app.use("/api/citas", citasRoutes);
app.use("/", indexRoutes);

// ✅ Ruta raíz para probar si el backend responde correctamente
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "🚀 Backend funcionando correctamente en Render" });
});

// ✅ Ruta de prueba para verificar conexión a la base de datos
app.get("/check-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW();"); // Prueba simple a PostgreSQL
    res.json({ message: "✅ Conexión exitosa a la base de datos", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en la conexión a la base de datos:", error);
    res.status(500).json({ message: "Error al conectar con la base de datos", error });
  }
});

// 🛑 Middleware global para manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error detectado:", err.message);
  res.status(500).json({ message: "Error interno del servidor" });
});

// 🔥 Iniciar servidor solo si la conexión a la base de datos es exitosa
const startServer = async () => {
  try {
    await pool.query("SELECT NOW();");
    console.log("✅ Conectado a la base de datos PostgreSQL en Render");

    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();
