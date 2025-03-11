"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validación para registro de usuario
exports.registerValidation = joi_1.default.object({
    nombre: joi_1.default.string().min(3).max(100).required(),
    usuario: joi_1.default.string().alphanum().min(3).max(50).required(),
    contrasena: joi_1.default.string().min(6).max(30).required(),
    rol: joi_1.default.string().valid("Admin", "Doctor").required(),
});
// Validación para iniciar sesión
exports.loginValidation = joi_1.default.object({
    usuario: joi_1.default.string().required(),
    contrasena: joi_1.default.string().required(),
    rol: joi_1.default.string().valid("Admin", "Doctor").required(),
});
