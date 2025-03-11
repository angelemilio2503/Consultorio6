"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const index_controller_1 = require("../controllers/index.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// 🔹 Usuarios
router.get("/users", (0, express_async_handler_1.default)(index_controller_1.getUsers));
router.get("/users/:id", (0, express_async_handler_1.default)(index_controller_1.getUserById));
router.post("/users", (0, express_async_handler_1.default)(index_controller_1.createUser));
router.put("/users/:id", (0, express_async_handler_1.default)(index_controller_1.updateUser));
router.delete("/users/:id", (0, express_async_handler_1.default)(index_controller_1.deleteUser));
// 🔹 Doctores
router.get("/doctores", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.getDoctores));
router.get("/doctores/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.getDoctoresById));
router.post("/doctores", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.createDoctores));
router.put("/doctores/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.updateDoctores));
router.delete("/doctores/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.deleteDoctores));
// 🔹 Pacientes
router.get("/pacientes", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.getPacientes));
router.get("/pacientes/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.getPacientesById));
router.post("/pacientes", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.createPacientes));
router.put("/pacientes/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.updatePacientes));
router.delete("/pacientes/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.deletePacientes));
// 🔹 Tareas
router.get("/tareas", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.getTareas));
router.get("/tareas/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.getTareasById));
router.post("/tareas", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.createTareas));
router.put("/tareas/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.updateTareas));
router.delete("/tareas/:id", auth_middleware_1.verifyToken, (0, express_async_handler_1.default)(index_controller_1.deleteTareas));
exports.default = router;
