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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPacientesDesencriptados = exports.listarPacientes = exports.getPacientes = exports.registerPaciente = void 0;
const express_1 = require("express");
const database_1 = require("../database");
const crypto_util_1 = require("../utils/crypto.util");
const router = (0, express_1.Router)();
// ✅ Registrar un nuevo paciente
const registerPaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, edad, padecimientos, tipo_sangre, discapacidades, diagnostico } = req.body;
        // Validar que todos los campos estén completos
        if (!nombre || !edad || !padecimientos || !tipo_sangre || !discapacidades || !diagnostico) {
            res.status(400).json({ message: "Todos los campos son obligatorios." });
            return;
        }
        // Encriptar datos sensibles
        const encryptedNombre = (0, crypto_util_1.encrypt)(nombre);
        const encryptedPadecimientos = (0, crypto_util_1.encrypt)(padecimientos);
        const encryptedTipoSangre = (0, crypto_util_1.encrypt)(tipo_sangre);
        const encryptedDiscapacidades = (0, crypto_util_1.encrypt)(discapacidades);
        const encryptedDiagnostico = (0, crypto_util_1.encrypt)(diagnostico);
        // Insertar datos en la base de datos
        yield database_1.pool.query("INSERT INTO pacientes (nombre, edad, padecimientos, tipo_sangre, discapacidades, diagnostico) VALUES ($1, $2, $3, $4, $5, $6)", [encryptedNombre, edad, encryptedPadecimientos, encryptedTipoSangre, encryptedDiscapacidades, encryptedDiagnostico]);
        res.status(201).json({ message: "Paciente registrado exitosamente." });
    }
    catch (error) {
        console.error("Error al registrar paciente:", error);
        res.status(500).json({ message: "Error interno al registrar paciente." });
    }
});
exports.registerPaciente = registerPaciente;
// ✅ Obtener pacientes con datos desencriptados
const getPacientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM pacientes");
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
        console.error("Error al obtener pacientes:", error);
        res.status(500).json({ message: "Error interno al obtener pacientes." });
    }
});
exports.getPacientes = getPacientes;
// ✅ Lista de pacientes con datos encriptados (para Thunder Client)
const listarPacientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM pacientes");
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error al listar pacientes:", error);
        res.status(500).json({ message: "Error al listar pacientes." });
    }
});
exports.listarPacientes = listarPacientes;
// ✅ Lista de pacientes con datos desencriptados
const listarPacientesDesencriptados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM pacientes");
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No hay pacientes registrados." });
            return;
        }
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
        console.error("Error al listar pacientes desencriptados:", error);
        res.status(500).json({ message: "Error al listar pacientes desencriptados." });
    }
});
exports.listarPacientesDesencriptados = listarPacientesDesencriptados;
// ✅ Definir rutas principales
router.get("/", exports.getPacientes);
router.post("/agregar", exports.registerPaciente);
router.get("/encriptados", exports.listarPacientes);
router.get("/desencriptados", exports.listarPacientesDesencriptados);
exports.default = router;
