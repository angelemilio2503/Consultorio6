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

// 🔹 Usuarios
router.get("/users", asyncHandler(getUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.post("/users", asyncHandler(createUser));
router.put("/users/:id", asyncHandler(updateUser));
router.delete("/users/:id", asyncHandler(deleteUser));

// 🔹 Doctores
router.get("/doctores", verifyToken, asyncHandler(getDoctores));
router.get("/doctores/:id", verifyToken, asyncHandler(getDoctoresById));
router.post("/doctores", verifyToken, asyncHandler(createDoctores));
router.put("/doctores/:id", verifyToken, asyncHandler(updateDoctores));
router.delete("/doctores/:id", verifyToken, asyncHandler(deleteDoctores));

// 🔹 Pacientes
router.get("/pacientes", verifyToken, asyncHandler(getPacientes));
router.get("/pacientes/:id", verifyToken, asyncHandler(getPacientesById));
router.post("/pacientes", verifyToken, asyncHandler(createPacientes));
router.put("/pacientes/:id", verifyToken, asyncHandler(updatePacientes));
router.delete("/pacientes/:id", verifyToken, asyncHandler(deletePacientes));

// 🔹 Tareas
router.get("/tareas", verifyToken, asyncHandler(getTareas));
router.get("/tareas/:id", verifyToken, asyncHandler(getTareasById));
router.post("/tareas", verifyToken, asyncHandler(createTareas));
router.put("/tareas/:id", verifyToken, asyncHandler(updateTareas));
router.delete("/tareas/:id", verifyToken, asyncHandler(deleteTareas));

export default router;
