"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const pacientes_controller_1 = require("../controllers/pacientes.controller");
const router = (0, express_1.Router)();
// ✅ Obtener todos los pacientes (desencriptados)
router.get("/", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(pacientes_controller_1.getPacientes));
// ✅ Obtener lista de pacientes encriptados (Thunder Client)
router.get("/encriptados", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(pacientes_controller_1.listarPacientes));
// ✅ Obtener paciente por ID (desencriptado)
router.get("/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(pacientes_controller_1.getPacienteById));
// ✅ Agregar un nuevo paciente (solo los doctores pueden hacerlo)
router.post("/agregar", auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRole)("Doctor"), (0, express_async_handler_1.default)(pacientes_controller_1.registerPaciente));
// ✅ Actualizar un paciente (solo los doctores pueden hacerlo)
router.put("/actualizar/:id", auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRole)("Doctor"), (0, express_async_handler_1.default)(pacientes_controller_1.updatePaciente));
// ✅ Eliminar un paciente (solo los administradores pueden hacerlo)
router.delete("/eliminar/:id", auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRole)("Admin"), (0, express_async_handler_1.default)(pacientes_controller_1.deletePaciente));
exports.default = router;
