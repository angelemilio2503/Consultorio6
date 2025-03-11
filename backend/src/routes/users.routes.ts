import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../database";
import asyncHandler from "express-async-handler";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post(
  "/registrar",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nombre, usuario, contrasena } = req.body;

    try {
      const existeUsuario = await pool.query("SELECT * FROM users WHERE usuario = $1", [usuario]);
      if (existeUsuario.rows.length > 0) {
        res.status(400).json({ mensaje: "El usuario ya existe" });
        return;
      }

      const hashedPassword = await bcrypt.hash(contrasena, 10);

      await pool.query(
        "INSERT INTO users (nombre, usuario, contrasena, rol) VALUES ($1, $2, $3, $4)",
        [nombre, usuario, hashedPassword, "Admin"]
      );

      res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
  })
);

export default router;
