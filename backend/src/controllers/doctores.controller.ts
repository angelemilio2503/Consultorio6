import { Request, Response } from "express";
import { pool } from "../database";
import bcrypt from "bcryptjs";

// ✅ Registrar un nuevo doctor
export const registerDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, usuario, contrasena } = req.body;

    // Validación básica
    if (!nombre || !usuario || !contrasena) {
      res.status(400).json({ message: "Todos los campos son obligatorios." });
      return;
    }

    // Verificar si el usuario ya existe
    const existingDoctor = await pool.query("SELECT * FROM doctores WHERE usuario = $1", [usuario]);
    if (existingDoctor.rows.length > 0) {
      res.status(409).json({ message: "El usuario ya existe." });
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar en la base de datos
    await pool.query(
      "INSERT INTO doctores (nombre, usuario, contrasena, rol) VALUES ($1, $2, $3, $4)",
      [nombre, usuario, hashedPassword, "Doctor"]
    );

    res.status(201).json({ message: "Doctor registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar doctor:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
