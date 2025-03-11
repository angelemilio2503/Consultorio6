import crypto from "crypto";

// Configuración del algoritmo y verificación de longitud
const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET || "";
const iv = process.env.ENCRYPTION_IV || "";

// Validación de longitud de la clave y el IV
if (secretKey.length !== 32) {
  throw new Error("La clave de encriptación (ENCRYPTION_SECRET) debe tener 32 caracteres.");
}

if (iv.length !== 16) {
  throw new Error("El IV de encriptación (ENCRYPTION_IV) debe tener 16 caracteres.");
}

// Función de encriptación
export const encrypt = (text: string): string => {
  try {
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(secretKey, "utf-8"),
      Buffer.from(iv, "utf-8")
    );
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("Error al encriptar los datos:", error);
    throw new Error("No se pudo encriptar el texto.");
  }
};

// Función de desencriptación
export const decrypt = (encryptedText: string): string => {
  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, "utf-8"),
      Buffer.from(iv, "utf-8")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    console.error("Error al desencriptar los datos:", error);
    return "Error de desencriptación"; // Retornar error como string para evitar romper el flujo de la aplicación
  }
};
