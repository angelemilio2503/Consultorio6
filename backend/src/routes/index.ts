import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  getUsers, getUserById, createUser, updateUser, deleteUser,
  getDoctores, getDoctoresById, createDoctores, updateDoctores, deleteDoctores,
  getPacientes, getPacientesById, createPacientes, updatePacientes, deletePacientes,
  getTareas, getTareasById, createTareas, updateTareas, deleteTareas
} from "../controllers/index.controller";
import { verifyToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Usuarios (Admins) - Se recomienda agregar autenticación si es necesario
router.get("/users", verifyToken, authorizeRole("Admin"), asyncHandler(getUsers));
router.get("/users/:id", verifyToken, authorizeRole("Admin"), asyncHandler(getUserById));
router.post("/users", verifyToken, authorizeRole("Admin"), asyncHandler(createUser));
router.put("/users/:id", verifyToken, authorizeRole("Admin"), asyncHandler(updateUser));
router.delete("/users/:id", verifyToken, authorizeRole("Admin"), asyncHandler(deleteUser));

// ✅ Doctores
router.get("/doctores", verifyToken, asyncHandler(getDoctores));
router.get("/doctores/:id", verifyToken, asyncHandler(getDoctoresById));
router.post("/doctores", verifyToken, authorizeRole("Admin"), asyncHandler(createDoctores)); // Solo Admins pueden crear
router.put("/doctores/:id", verifyToken, authorizeRole("Admin"), asyncHandler(updateDoctores));
router.delete("/doctores/:id", verifyToken, authorizeRole("Admin"), asyncHandler(deleteDoctores));

// ✅ Pacientes
router.get("/pacientes", verifyToken, asyncHandler(getPacientes));
router.get("/pacientes/:id", verifyToken, asyncHandler(getPacientesById));
router.post("/pacientes", verifyToken, authorizeRole("Doctor"), asyncHandler(createPacientes)); // Solo los doctores pueden agregar pacientes
router.put("/pacientes/:id", verifyToken, authorizeRole("Doctor"), asyncHandler(updatePacientes));
router.delete("/pacientes/:id", verifyToken, authorizeRole("Admin"), asyncHandler(deletePacientes)); // Solo Admins pueden eliminar pacientes

// ✅ Tareas
router.get("/tareas", verifyToken, asyncHandler(getTareas));
router.get("/tareas/:id", verifyToken, asyncHandler(getTareasById));
router.post("/tareas", verifyToken, asyncHandler(createTareas));
router.put("/tareas/:id", verifyToken, asyncHandler(updateTareas));
router.delete("/tareas/:id", verifyToken, asyncHandler(deleteTareas));

export default router;
