"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.loginUser = void 0;
const database_1 = require("../database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
const crypto = __importStar(require("crypto")); // ✅ Corrección para crypto en TypeScript
dotenv.config();
const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET; // ✅ Se asegura de que sea un string
const iv = crypto.randomBytes(16);
// 🔐 Funciones de encriptación y desencriptación
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, "utf-8"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};
const decrypt = (text) => {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts[0], "hex");
    const encryptedText = Buffer.from(textParts[1], "hex");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, "utf-8"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
// 🔒 Login y generación de JWT con tipos correctos
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, contrasena, rol } = req.body;
        // Buscar usuario en la base de datos
        const result = yield database_1.pool.query("SELECT * FROM users WHERE usuario = $1 AND rol = $2", [usuario, rol]);
        if (result.rows.length === 0) {
            res.status(401).json({ message: "Usuario o contraseña incorrecta" });
            return;
        }
        const user = result.rows[0];
        // Verificar contraseña
        const validPassword = yield bcryptjs_1.default.compare(contrasena, user.contrasena);
        if (!validPassword) {
            res.status(401).json({ message: "Usuario o contraseña incorrecta" });
            return;
        }
        // Desencriptar el email
        const decryptedEmail = decrypt(user.email);
        // Generar JWT con opciones tipadas
        const jwtSecret = process.env.JWT_SECRET;
        const options = { expiresIn: "1h" };
        const token = jsonwebtoken_1.default.sign({ id: user.id, usuario: user.usuario, rol: user.rol }, jwtSecret, options);
        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token, // ✅ El token está permitido
            user: { id: user.id, usuario: user.usuario, rol: user.rol } // ❌ No se deben devolver datos sensibles como email cifrado
        });
    }
    catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.loginUser = loginUser;
