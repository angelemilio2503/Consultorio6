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

dotenv.config(); // Cargar variables de entorno

// ✅ Verificación de variables de entorno esenciales
const requiredEnvVars = ["JWT_SECRET", "ENCRYPTION_SECRET", "DB_HOST"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Error: Faltan variables de entorno requeridas: ${missingEnvVars.join(", ")}`);
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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por IP
    message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
  })
);

// ✅ Configuración de CORS con múltiples orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL, // ✅ Se usa la variable de entorno en Render
  "http://localhost:5173"  // Permitir para desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("🚫 Bloqueado por CORS:", origin);
        callback(new Error("🚫 No autorizado por CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);


// 🚀 Habilitar el parsing de JSON
app.use(express.json());

// 📌 Definición de rutas
app.use("/auth", authRoutes);
app.use("/doctores", doctoresRoutes);
app.use("/pacientes", pacientesRoutes);
app.use("/api", citasRoutes);

// ✅ Nueva ruta raíz para probar si el backend responde correctamente
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

// 🔥 Iniciar servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);

  // ✅ Verificar conexión con la base de datos al iniciar
  try {
    await pool.query("SELECT NOW();");
    console.log("✅ Conectado a la base de datos PostgreSQL en Render");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
  }
}).on("error", (err) => {
  console.error("❌ Error al iniciar el servidor:", err);
  process.exit(1);
});
