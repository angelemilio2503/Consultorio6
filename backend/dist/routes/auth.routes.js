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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../database");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// ✅ Ruta de inicio de sesión unificada para Admins y Doctores
router.post("/login", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, contrasena, rol } = req.body;
    if (!usuario || !contrasena || !rol) {
        res.status(400).json({ mensaje: "Usuario, contraseña y rol son obligatorios." });
        return;
    }
    try {
        let result;
        let userType = rol;
        // 🔍 Buscar en la tabla correspondiente según el rol
        if (rol === "Admin") {
            result = yield database_1.pool.query("SELECT * FROM users WHERE usuario = $1", [usuario]);
        }
        else if (rol === "Doctor") {
            result = yield database_1.pool.query("SELECT * FROM doctores WHERE usuario = $1", [usuario]);
        }
        else {
            res.status(400).json({ mensaje: "Rol inválido" });
            return;
        }
        if (result.rows.length === 0) {
            res.status(401).json({ mensaje: "Usuario o contraseña incorrecta" });
            return;
        }
        const user = result.rows[0];
        // 🔐 Verificar la contraseña
        const validPassword = yield bcryptjs_1.default.compare(contrasena, user.contrasena);
        if (!validPassword) {
            res.status(401).json({ mensaje: "Usuario o contraseña incorrecta" });
            return;
        }
        // 🔑 Generar token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, usuario: user.usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: user.id,
                nombre: user.nombre,
                rol: user.rol || userType,
            },
        });
    }
    catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
})));
exports.default = router;
