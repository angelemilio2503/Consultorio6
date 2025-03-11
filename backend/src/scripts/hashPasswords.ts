import { pool } from "../database";
import bcrypt from "bcryptjs";

const hashPasswords = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");

    for (const users of result.rows) {
      const hashedPassword = await bcrypt.hash(users.contrasena, 10);
      await pool.query("UPDATE users SET contrasena = $1 WHERE id = $2", [
        hashedPassword,
        users.id,
      ]);
    }

    console.log("Contraseñas actualizadas correctamente.");
  } catch (error) {
    console.error("Error al actualizar contraseñas:", error);
  }
};

hashPasswords();
