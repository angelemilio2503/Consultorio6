import { Router } from "express";
import asyncHandler from "express-async-handler";
import { verifyToken, authorizeRole } from "../middlewares/auth.middleware";
import {
  getPacientes,
  getPacienteById,
  registerPaciente,
  updatePaciente,
  deletePaciente,
  listarPacientes,
} from "../controllers/pacientes.controller";

const router = Router();

// ✅ Obtener todos los pacientes (desencriptados)
router.get("/", verifyToken, asyncHandler(getPacientes));

// ✅ Obtener lista de pacientes encriptados (Thunder Client)
router.get("/encriptados", verifyToken, asyncHandler(listarPacientes));

// ✅ Obtener paciente por ID (desencriptado)
router.get("/:id", verifyToken, asyncHandler(getPacienteById));

// ✅ Agregar un nuevo paciente (solo los doctores pueden hacerlo)
router.post("/agregar", verifyToken, authorizeRole("Doctor"), asyncHandler(registerPaciente));

// ✅ Actualizar un paciente (solo los doctores pueden hacerlo)
router.put("/actualizar/:id", verifyToken, authorizeRole("Doctor"), asyncHandler(updatePaciente));

// ✅ Eliminar un paciente (solo los administradores pueden hacerlo)
router.delete("/eliminar/:id", verifyToken, authorizeRole("Admin"), asyncHandler(deletePaciente));

export default router;
