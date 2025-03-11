import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const secret: Secret = process.env.JWT_SECRET as Secret;

if (!secret) {
  throw new Error("La variable JWT_SECRET no está definida en el archivo .env");
}

// ✅ Middleware para verificar el token JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(403).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Token inválido o expirado" });
      return;
    }

    // Agregar datos decodificados al objeto `req`
    (req as any).user = decoded;
    next();
  });
};

// ✅ Middleware para autorizar por rol (acepta múltiples roles)
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.rol)) {
      res.status(403).json({ message: "No tienes permiso para acceder a esta función" });
      return;
    }

    next();
  };
};
