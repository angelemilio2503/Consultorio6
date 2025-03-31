import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});




pool.connect()
  .then(() => console.log(`✅ Conectado a PostgreSQL (${isProduction ? "Producción (Render)" : "Local"})`))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err));
