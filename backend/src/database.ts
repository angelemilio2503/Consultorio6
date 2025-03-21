import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  user: isProduction ? process.env.PROD_DB_USER : process.env.LOCAL_DB_USER,
  host: isProduction ? process.env.PROD_DB_HOST : process.env.LOCAL_DB_HOST,
  database: isProduction ? process.env.PROD_DB_NAME : process.env.LOCAL_DB_NAME,
  password: isProduction ? process.env.PROD_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
  port: Number(isProduction ? process.env.PROD_DB_PORT : process.env.LOCAL_DB_PORT) || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  keepAlive: true,  // ✅ Importante para evitar desconexiones
});


pool.connect()
  .then(() => console.log(`✅ Conectado a PostgreSQL (${isProduction ? "Producción (Render)" : "Local"})`))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err));
