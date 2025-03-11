import express, { Request, Response } from "express";
import { Client } from "pg";  // Para PostgreSQL
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Configuración de la conexión a PostgreSQL
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",    // Cambia por tu usuario de PostgreSQL
  password: "Mtzlopez1092",  // Cambia por tu contraseña
  database: "sistema_consultorio"  // Cambia por el nombre de tu base de datos
});

// Conectar a la base de datos PostgreSQL
client.connect().then(() => console.log("Conectado a PostgreSQL")).catch((err) => console.error("Error al conectar a PostgreSQL", err));

// Crear una instancia de Express
const app = express();

// Middleware para parsear JSON (puedes usar directamente `express.json()`)
app.use(express.json());  // Esto reemplaza a `bodyParser.json()`

// Ruta para login
app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Buscar al usuario en la base de datos
    const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      // Respuesta si el usuario no existe
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Respuesta si la contraseña no coincide
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id }, "miSecreto", { expiresIn: "1h" });

    // Respuesta exitosa
    return res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error(error);

    // Respuesta para errores del servidor
    return res.status(500).json({ message: "Error en el servidor" });
  }
});




// Importa las rutas de autenticación desde `authRoutes.ts`
import authRoutes from './routes/authRoutes';  // Asegúrate de tener este archivo de rutas

// Usar las rutas de autenticación bajo el prefijo `/api`
app.use('/api', authRoutes);

// Puerto donde se ejecutará el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
