import { Router, Request, Response } from "express";
import { pool } from "../database";
import { encrypt, decrypt } from "../utils/crypto.util";
import asyncHandler from "express-async-handler";
import { verifyToken, authorizeRole } from "../middlewares/auth.middleware";
import { listarPacientes, listarPacientesDesencriptados, registerPaciente } from "../controllers/pacientes.controller";

const router = Router();

// ✅ Ruta con datos encriptados (Thunder Client)
router.get("/", verifyToken, listarPacientes);

// 🔓 Ruta con datos desencriptados (Frontend)
router.get("/desencriptados", verifyToken, listarPacientesDesencriptados);

// ✅ Agregar nuevo paciente (solo Admin)
router.post(
  "/agregar",
  verifyToken,
  authorizeRole("Admin"),
  asyncHandler(registerPaciente)
);

// ✅ Ruta para listar pacientes desencriptados (sólo Admin puede acceder)
router.get(
  "/listar",
  verifyToken,
  authorizeRole("Admin"),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query("SELECT * FROM pacientes");

      if (result.rows.length === 0) {
        res.status(404).json({ mensaje: "No hay pacientes registrados." });
        return;
      }

      // Desencriptar datos sensibles
      const pacientes = result.rows.map((paciente: any) => ({
        id: paciente.id,
        nombre: decrypt(paciente.nombre),
        edad: paciente.edad,
        padecimientos: decrypt(paciente.padecimientos),
        tipo_sangre: decrypt(paciente.tipo_sangre),
        discapacidades: decrypt(paciente.discapacidades),
        diagnostico: decrypt(paciente.diagnostico),
      }));

      res.status(200).json(pacientes);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  })
);

export default router;
