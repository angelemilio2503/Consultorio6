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

const PORT = process.env.PORT || 3000;
const app = express();

// 🔒 Seguridad con Helmet
app.use(helmet());

// 🔒 Protección contra ataques de fuerza bruta con Rate Limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: "🚫 Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
  })
);

// 📌 Lista de orígenes permitidos
const allowedOrigins = [
  "https://consultorio6-2cd6-r3k2z4rp8-kato-citys-projects.vercel.app", // 🚀 Reemplaza con la URL correcta de tu frontend en Vercel
  "http://localhost:5173" // Para desarrollo local
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

// ✅ Ruta de prueba para verificar el backend
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "🚀 Backend funcionando correctamente en Render" });
});

// ✅ Ruta de prueba para verificar conexión a la base de datos
app.get("/check-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW();");
    res.json({ message: "✅ Conexión exitosa a la base de datos", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en la conexión a la base de datos:", error);
    res.status(500).json({ message: "Error al conectar con la base de datos", error });
  }
});

// ✅ Middleware para manejar errores
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
