import { Request, Response, Router } from "express";
import { pool } from "../database";
import { encrypt, decrypt } from "../utils/crypto.util";

const router = Router();

// ✅ Registrar un nuevo paciente
export const registerPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, edad, padecimientos, tipo_sangre, discapacidades, diagnostico } = req.body;

    // Validar que todos los campos estén completos
    if (!nombre || !edad || !padecimientos || !tipo_sangre || !discapacidades || !diagnostico) {
      res.status(400).json({ message: "Todos los campos son obligatorios." });
      return;
    }

    // Encriptar datos sensibles
    const encryptedNombre = encrypt(nombre);
    const encryptedPadecimientos = encrypt(padecimientos);
    const encryptedTipoSangre = encrypt(tipo_sangre);
    const encryptedDiscapacidades = encrypt(discapacidades);
    const encryptedDiagnostico = encrypt(diagnostico);

    // Insertar datos en la base de datos
    await pool.query(
      "INSERT INTO pacientes (nombre, edad, padecimientos, tipo_sangre, discapacidades, diagnostico) VALUES ($1, $2, $3, $4, $5, $6)",
      [encryptedNombre, edad, encryptedPadecimientos, encryptedTipoSangre, encryptedDiscapacidades, encryptedDiagnostico]
    );

    res.status(201).json({ message: "Paciente registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar paciente:", error);
    res.status(500).json({ message: "Error interno al registrar paciente." });
  }
};

// ✅ Obtener pacientes con datos desencriptados
export const getPacientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM pacientes");

    const pacientes = result.rows.map((paciente) => ({
      id: paciente.id,
      nombre: decrypt(paciente.nombre),
      edad: paciente.edad,
      padecimientos: decrypt(paciente.padecimientos),
      tipo_sangre: decrypt(paciente.tipo_sangre),
      discapacidades: decrypt(paciente.discapacidades),
      diagnostico: decrypt(paciente.diagnostico),
    }));

    res.status(200).json(pacientes);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).json({ message: "Error interno al obtener pacientes." });
  }
};

// ✅ Lista de pacientes con datos encriptados (para Thunder Client)
export const listarPacientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM pacientes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al listar pacientes:", error);
    res.status(500).json({ message: "Error al listar pacientes." });
  }
};

// ✅ Lista de pacientes con datos desencriptados
export const listarPacientesDesencriptados = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM pacientes");

    if (result.rows.length === 0) {
      res.status(404).json({ message: "No hay pacientes registrados." });
      return;
    }

    const pacientes = result.rows.map((paciente) => ({
      id: paciente.id,
      nombre: decrypt(paciente.nombre),
      edad: paciente.edad,
      padecimientos: decrypt(paciente.padecimientos),
      tipo_sangre: decrypt(paciente.tipo_sangre),
      discapacidades: decrypt(paciente.discapacidades),
      diagnostico: decrypt(paciente.diagnostico),
    }));

    res.status(200).json(pacientes);
  } catch (error) {
    console.error("Error al listar pacientes desencriptados:", error);
    res.status(500).json({ message: "Error al listar pacientes desencriptados." });
  }
};

// ✅ Definir rutas principales
router.get("/", getPacientes);
router.post("/agregar", registerPaciente);
router.get("/encriptados", listarPacientes);
router.get("/desencriptados", listarPacientesDesencriptados);

export default router;
