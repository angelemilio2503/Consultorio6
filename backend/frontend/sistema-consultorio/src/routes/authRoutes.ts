import express from 'express';
import { login } from '../controllers/authController';  // Asegúrate de que la función `login` esté correctamente exportada

const router = express.Router();

// Ruta para manejar el login
router.post('/login', login);  // Aquí estamos vinculando el controlador `login`

export default router;