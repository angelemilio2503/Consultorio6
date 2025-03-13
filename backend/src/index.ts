import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pool } from "./database"; 
import authRoutes from "./routes/auth.routes";
import indexRoutes from "./routes/index";
import doctoresRoutes from "./routes/doctores.routes";
import pacientesRoutes from "./routes/pacientes.routes";
import citasRoutes from "./routes/citas";

dotenv.config(); 

// ✅ Verificación de variables de entorno esenciales
const requiredEnvVars = ["JWT_SECRET", "ENCRYPTION_SECRET", "DATABASE_URL"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Error: Faltan variables de entorno requeridas: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

console.log("✅ JWT_SECRET loaded:", process.env.JWT_SECRET ? "✔️ Loaded" : "❌ Not Loaded");

// 🚀 Configuración del servidor
const PORT = process.env.PORT || 3000;
const app = express();

// 🔒 Seguridad con Helmet
app.use(helmet());

// 🔒 Protección contra ataques de fuerza bruta con Rate Limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
  })
);

// 📌 Lista de orígenes permitidos 
const allowedOrigins = [
  "https://consultorio6-2cd6.vercel.app", 
  "http://localhost:5173"
];

// 📌 Middleware de CORS
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

// 🚀 Middleware para procesar JSON
app.use(express.json());

// 📌 Definición de rutas
app.use("/auth", authRoutes);
app.use("/doctores", doctoresRoutes);
app.use("/pacientes", pacientesRoutes);
app.use("/api", citasRoutes);
app.use("/", indexRoutes);

// ✅ Verificar conexión a la base de datos
app.get("/check-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW();");
    res.json({ message: "✅ Conexión exitosa a la base de datos", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en la conexión a la base de datos:", error);
    res.status(500).json({ message: "Error al conectar con la base de datos", error });
  }
});

// 🔥 Iniciar servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);

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
