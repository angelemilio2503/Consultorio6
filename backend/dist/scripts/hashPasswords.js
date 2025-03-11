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
const database_1 = require("../database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPasswords = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM users");
        for (const users of result.rows) {
            const hashedPassword = yield bcryptjs_1.default.hash(users.contrasena, 10);
            yield database_1.pool.query("UPDATE users SET contrasena = $1 WHERE id = $2", [
                hashedPassword,
                users.id,
            ]);
        }
        console.log("Contraseñas actualizadas correctamente.");
    }
    catch (error) {
        console.error("Error al actualizar contraseñas:", error);
    }
});
hashPasswords();
