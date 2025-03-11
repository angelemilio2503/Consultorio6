"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const crypto_util_1 = require("../utils/crypto.util");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const pacientes_controller_1 = require("../controllers/pacientes.controller");
const router = (0, express_1.Router)();
// ✅ Ruta con datos encriptados (Thunder Client)
router.get("/", auth_middleware_1.verifyToken, pacientes_controller_1.listarPacientes);
// 🔓 Ruta con datos desencriptados (Frontend)
router.get("/desencriptados", auth_middleware_1.verifyToken, pacientes_controller_1.listarPacientesDesencriptados);
// ✅ Agregar nuevo paciente (solo Admin)
router.post("/agregar", auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRole)("Admin"), (0, express_async_handler_1.default)(pacientes_controller_1.registerPaciente));
// ✅ Ruta para listar pacientes desencriptados (sólo Admin puede acceder)
router.get("/listar", auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRole)("Admin"), (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM pacientes");
        if (result.rows.length === 0) {
            res.status(404).json({ mensaje: "No hay pacientes registrados." });
            return;
        }
        // Desencriptar datos sensibles
        const pacientes = result.rows.map((paciente) => ({
            id: paciente.id,
            nombre: (0, crypto_util_1.decrypt)(paciente.nombre),
            edad: paciente.edad,
            padecimientos: (0, crypto_util_1.decrypt)(paciente.padecimientos),
            tipo_sangre: (0, crypto_util_1.decrypt)(paciente.tipo_sangre),
            discapacidades: (0, crypto_util_1.decrypt)(paciente.discapacidades),
            diagnostico: (0, crypto_util_1.decrypt)(paciente.diagnostico),
        }));
        res.status(200).json(pacientes);
    }
    catch (error) {
        console.error("Error al obtener los pacientes:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
})));
exports.default = router;
