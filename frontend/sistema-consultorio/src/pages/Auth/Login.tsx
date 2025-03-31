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
  const [showSupportInfo, setShowSupportInfo] = useState(false);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const toggleSupportInfo = () => {
    setShowSupportInfo((prev) => !prev);
  };

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

      const API_URL = import.meta.env.VITE_API_URL || "https://consultorio5.onrender.com";
      console.log("📩 Enviando solicitud a:", `${API_URL}/auth/login`);
      console.log("📌 Datos enviados:", loginData);

      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Respuesta recibida:", response.data);

      const { token, usuario } = response.data;

      if (!token) {
        throw new Error("Token no recibido en la respuesta del servidor.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));
      localStorage.setItem("auth", "true");

      alert(`✅ Inicio de sesión exitoso, bienvenido ${usuario.nombre}`);
      console.log("✅ Redirigiendo al Dashboard...");

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error: unknown) {
      console.error("❌ Error en login:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.mensaje || "❌ Usuario, contraseña o rol incorrectos");
      } else {
        setError("⚠️ Error desconocido al iniciar sesión.");
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

              <Typography
                variant="body2"
                sx={{ mt: 2, color: "#0090FF", cursor: "pointer", textDecoration: "underline" }}
                onClick={toggleSupportInfo}
              >
                ¿Olvidaste tu contraseña?
              </Typography>

              {showSupportInfo && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  📞 Contacta al desarrollador para restablecer tu contraseña: <br />
                  <strong>+52 826 169 2749</strong>
                </Alert>
              )}
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
};

export default Login;
