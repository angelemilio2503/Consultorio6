import { Router, Request, Response } from "express";
import { pool } from "../database";
import asyncHandler from "express-async-handler";
import { verifyToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Obtener todos los doctores (Disponible para todos los roles autenticados)
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query("SELECT * FROM doctores ORDER BY id ASC");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("❌ Error al obtener la lista de doctores:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  })
);

// ✅ Registrar un nuevo doctor (solo Admin)
router.post(
  "/",
  verifyToken,
  authorizeRole("Admin"),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nombre, cedula, especializacion, area, telefono } = req.body;

    if (!nombre || !cedula || !especializacion || !area || !telefono) {
      res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
      return;
    }

    try {
      // Verificar si ya existe un doctor con la misma cédula
      const existeDoctor = await pool.query("SELECT * FROM doctores WHERE cedula = $1", [cedula]);
      if (existeDoctor.rows.length > 0) {
        res.status(400).json({ mensaje: "Un doctor con esta cédula ya está registrado." });
        return;
      }

      // Insertar nuevo doctor
      await pool.query(
        "INSERT INTO doctores (nombre, cedula, especializacion, area, telefono) VALUES ($1, $2, $3, $4, $5)",
        [nombre, cedula, especializacion, area, telefono]
      );

      res.status(201).json({ mensaje: "✅ Doctor agregado exitosamente." });
    } catch (error) {
      console.error("❌ Error al registrar doctor:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  })
);

// ✅ Obtener un doctor por ID
router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const doctor = await pool.query("SELECT * FROM doctores WHERE id = $1", [id]);
      if (doctor.rows.length === 0) {
        res.status(404).json({ mensaje: "Doctor no encontrado." });
        return;
      }
      res.status(200).json(doctor.rows[0]);
    } catch (error) {
      console.error("❌ Error al obtener el doctor:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  })
);

// ✅ Actualizar información de un doctor (solo Admin)
router.put(
  "/:id",
  verifyToken,
  authorizeRole("Admin"),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nombre, cedula, especializacion, area, telefono } = req.body;

    if (!nombre || !cedula || !especializacion || !area || !telefono) {
      res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
      return;
    }

    try {
      // Verificar si el doctor existe
      const doctorExistente = await pool.query("SELECT * FROM doctores WHERE id = $1", [id]);
      if (doctorExistente.rows.length === 0) {
        res.status(404).json({ mensaje: "Doctor no encontrado." });
        return;
      }

      // Actualizar datos del doctor
      await pool.query(
        "UPDATE doctores SET nombre = $1, cedula = $2, especializacion = $3, area = $4, telefono = $5 WHERE id = $6",
        [nombre, cedula, especializacion, area, telefono, id]
      );

      res.status(200).json({ mensaje: "✅ Doctor actualizado exitosamente." });
    } catch (error) {
      console.error("❌ Error al actualizar doctor:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  })
);

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM doctores");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener doctores", error });
  }
});

// ✅ Eliminar un doctor (solo Admin)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("Admin"),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      // Verificar si el doctor existe antes de eliminar
      const doctorExistente = await pool.query("SELECT * FROM doctores WHERE id = $1", [id]);
      if (doctorExistente.rows.length === 0) {
        res.status(404).json({ mensaje: "Doctor no encontrado." });
        return;
      }

      // Eliminar doctor
      await pool.query("DELETE FROM doctores WHERE id = $1", [id]);
      res.status(200).json({ mensaje: "✅ Doctor eliminado exitosamente." });
    } catch (error) {
      console.error("❌ Error al eliminar doctor:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  })
);

export default router;
