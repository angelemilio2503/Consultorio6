import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../database";
import asyncHandler from "express-async-handler";

const router = Router();

// ✅ Ruta de inicio de sesión unificada para Admins y Doctores
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { usuario, contrasena, rol } = req.body;

    if (!usuario || !contrasena || !rol) {
      res.status(400).json({ mensaje: "Usuario, contraseña y rol son obligatorios." });
      return;
    }

    try {
      let result;
      let userType = rol;

      // 🔍 Buscar en la tabla correspondiente según el rol
      if (rol === "Admin") {
        result = await pool.query("SELECT * FROM users WHERE usuario = $1", [usuario]);
      } else if (rol === "Doctor") {
        result = await pool.query("SELECT * FROM doctores WHERE usuario = $1", [usuario]);
      } else {
        res.status(400).json({ mensaje: "Rol inválido" });
        return;
      }

      if (result.rows.length === 0) {
        res.status(401).json({ mensaje: "Usuario o contraseña incorrecta" });
        return;
      }

      const user = result.rows[0];

      // 🔐 Verificar la contraseña
      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      if (!validPassword) {
        res.status(401).json({ mensaje: "Usuario o contraseña incorrecta" });
        return;
      }

      // 🔑 Generar token JWT
      const token = jwt.sign(
        { id: user.id, usuario: user.usuario, rol: user.rol },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        mensaje: "Inicio de sesión exitoso",
        token,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          rol: user.rol || userType,
        },
      });
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  })
);

export default router;
