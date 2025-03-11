import { Router, Request, Response } from "express";
import { pool } from "../database";
import asyncHandler from "express-async-handler";
import { verifyToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Ruta para obtener todos los doctores desde la tabla doctores_users (Disponible para todos los roles autenticados)
router.get(
  "/doctores_users",
  verifyToken,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query("SELECT * FROM doctores_users");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error al obtener los doctores:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  })
);

// ✅ Ruta para registrar un nuevo doctor directamente en doctores_users (solo Admin)
router.post(
  "/registrar",
  verifyToken,
  authorizeRole("Admin"), // Solo permite a usuarios con rol Admin
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nombre, cedula, especializacion, area, telefono } = req.body;

    if (!nombre || !cedula || !especializacion || !area || !telefono) {
      res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
      return;
    }

    try {
      const existeDoctor = await pool.query("SELECT * FROM doctores_users WHERE cedula = $1", [cedula]);
      if (existeDoctor.rows.length > 0) {
        res.status(400).json({ mensaje: "Un doctor con esta cédula ya está registrado" });
        return;
      }

      await pool.query(
        "INSERT INTO doctores_users (nombre, cedula, especializacion, area, telefono) VALUES ($1, $2, $3, $4, $5)",
        [nombre, cedula, especializacion, area, telefono]
      );

      res.status(201).json({ mensaje: "Doctor agregado exitosamente" });
    } catch (error) {
      console.error("Error al registrar doctor:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  })
);

// ✅ Ruta para eliminar un doctor por ID (solo Admin)
router.delete(
  "/doctores_users/:id",
  verifyToken,
  authorizeRole("Admin"), // Solo permite a usuarios con rol Admin
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const doctorExistente = await pool.query("SELECT * FROM doctores_users WHERE id = $1", [id]);
      if (doctorExistente.rows.length === 0) {
        res.status(404).json({ mensaje: "Doctor no encontrado" });
        return;
      }

      await pool.query("DELETE FROM doctores_users WHERE id = $1", [id]);
      res.status(200).json({ mensaje: "Doctor eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar doctor:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  })
);

export default router;
