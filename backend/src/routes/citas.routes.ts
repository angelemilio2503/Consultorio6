import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita,
} from "../controllers/citas.controller";
import { verifyToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Rutas para Citas
router.get("/", verifyToken, asyncHandler(getCitas));
router.get("/:id", verifyToken, asyncHandler(getCitaById));
router.post("/", verifyToken, authorizeRole("Doctor"), asyncHandler(createCita));
router.put("/:id", verifyToken, authorizeRole("Doctor"), asyncHandler(updateCita));
router.delete("/:id", verifyToken, authorizeRole("Admin"), asyncHandler(deleteCita));

export default router;
