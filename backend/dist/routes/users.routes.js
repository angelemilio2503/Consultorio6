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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../database");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// Ruta para registrar un nuevo usuario
router.post("/registrar", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, usuario, contrasena } = req.body;
    try {
        const existeUsuario = yield database_1.pool.query("SELECT * FROM users WHERE usuario = $1", [usuario]);
        if (existeUsuario.rows.length > 0) {
            res.status(400).json({ mensaje: "El usuario ya existe" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
        yield database_1.pool.query("INSERT INTO users (nombre, usuario, contrasena, rol) VALUES ($1, $2, $3, $4)", [nombre, usuario, hashedPassword, "Admin"]);
        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
})));
exports.default = router;
