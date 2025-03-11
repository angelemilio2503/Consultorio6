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
// routes/citas.ts
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const router = express_1.default.Router();
// Obtener todas las citas
router.get('/citas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query('SELECT * FROM citas');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener citas', error });
    }
}));
// Agregar una nueva cita
router.post('/citas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha, nombre_paciente, nombre_doctor, motivo, estado } = req.body;
    try {
        const result = yield database_1.pool.query('INSERT INTO citas (fecha, nombre_paciente, nombre_doctor, motivo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *', [fecha, nombre_paciente, nombre_doctor, motivo, estado]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la cita', error });
    }
}));
exports.default = router;
