import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { pool } from "./database";
import doctorRoutes from "./routes/doctores.routes";
import citasRoutes from "./routes/citas";
import pacientesRoutes from "./routes/pacientes.routes";
import authRoutes from "./routes/auth.routes";

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ✅ Configurar CORS correctamente
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Agrega ambos orígenes si el frontend cambia de puerto
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Asegura que se permitan los headers correctos
  credentials: true, // Permitir cookies si se usan
};

app.use(cors(corsOptions));
app.use(express.json()); // Permite recibir datos en formato JSON

// ✅ Ruta de prueba para asegurar que el servidor funciona
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Servidor del sistema de consultorio funcionando correctamente.");
});

// ✅ Rutas de la API
app.use("/api/doctores", doctorRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/auth", authRoutes);

// ✅ Conexión a la base de datos
pool
  .connect()
  .then(() => {
    console.log("✅ Conexión exitosa a PostgreSQL");
  })
  .catch((err: Error) => {
    console.error("❌ Error al conectar con PostgreSQL:", err);
  });

// ✅ Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// ✅ Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
