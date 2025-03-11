import { Request, Response } from "express";
import { pool } from "../database";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as crypto from "crypto"; // ✅ Corrección para crypto en TypeScript

dotenv.config();

const algorithm = "aes-256-cbc";
const secretKey: string = process.env.ENCRYPTION_SECRET as string; // ✅ Se asegura de que sea un string
const iv: Buffer = crypto.randomBytes(16);

// 🔐 Funciones de encriptación y desencriptación
const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, "utf-8"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (text: string): string => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedText = Buffer.from(textParts[1], "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, "utf-8"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// 🔒 Login y generación de JWT con tipos correctos
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario, contrasena, rol } = req.body;

    // Buscar usuario en la base de datos
    const result = await pool.query("SELECT * FROM users WHERE usuario = $1 AND rol = $2", [usuario, rol]);

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Usuario o contraseña incorrecta" });
      return;
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      res.status(401).json({ message: "Usuario o contraseña incorrecta" });
      return;
    }

    // Desencriptar el email
    const decryptedEmail = decrypt(user.email);

    // Generar JWT con opciones tipadas
    const jwtSecret: Secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: "1h" };

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      jwtSecret,
      options
    );

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token, // ✅ El token está permitido
      user: { id: user.id, usuario: user.usuario, rol: user.rol } // ❌ No se deben devolver datos sensibles como email cifrado
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
