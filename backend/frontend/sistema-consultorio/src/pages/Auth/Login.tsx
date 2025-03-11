import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../../imagenes/consultorio.jpg";
import { motion } from "framer-motion";
import React from 'react';


// Animaciones de entrada y salida para la página completa
const pageTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
};

// Animación para el formulario
const formTransition = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
};

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

    // 🔒 Evitar retroceso a la página anterior después de iniciar sesión
    useEffect(() => {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
      };
    }, []);

  const handleLogin = async () => {
    if (!identifier || !password || !role) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isEmail = /\S+@\S+\.\S+/.test(identifier);
      const loginData = isEmail
        ? { email: identifier, contrasena: password, rol: role }
        : { usuario: identifier, contrasena: password, rol: role };

      const response = await axios.post(
        "http://localhost:3000/auth/login",
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      alert(`Inicio de sesión exitoso, bienvenido ${usuario.nombre}`);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.mensaje || "Usuario, contraseña o rol incorrectos");
      } else {
        setError("Error desconocido al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xs">
          <motion.div variants={formTransition} initial="initial" animate="animate">
            <Paper
              elevation={5}
              sx={{
                padding: 4,
                textAlign: "center",
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "#0090FF", fontWeight: "bold", mb: 2 }}
              >
                Iniciar Sesión
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                label="Correo electrónico o Usuario"
                margin="normal"
                variant="outlined"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                select
                label="Rol"
                margin="normal"
                variant="outlined"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="Doctor">Doctor</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "#0090FF",
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#2ECC62" },
                }}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Ingresar"}
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
};

export default Login;
