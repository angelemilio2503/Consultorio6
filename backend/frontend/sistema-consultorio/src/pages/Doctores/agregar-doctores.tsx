import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { motion } from "framer-motion";
import React from 'react';


// Animaciones
const pageTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
};

const buttonAnimation = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

const AgregarDoctor = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    nombre: "",
    cedula: "",
    especializacion: "",
    area: "",
    telefono: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No tienes acceso. Inicia sesión.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/doctores/registrar", doctor, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("Doctor agregado exitosamente.");
      navigate("/doctores"); // Redirige a la lista de doctores
    } catch (error) {
      console.error("Error:", error);
      setError("Error al agregar doctor. Inténtalo de nuevo.");
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
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "400px", borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
            Agregar Doctor
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Nombre" name="nombre" margin="normal" onChange={handleChange} required />
            <TextField fullWidth label="Cédula" name="cedula" margin="normal" onChange={handleChange} required />
            <TextField fullWidth label="Especialización" name="especializacion" margin="normal" onChange={handleChange} required />
            <TextField fullWidth label="Área" name="area" margin="normal" onChange={handleChange} required />
            <TextField fullWidth label="Teléfono" name="telefono" margin="normal" onChange={handleChange} required />

            {/* Botón de Guardar con animaciones */}
            <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Guardar
              </Button>
            </motion.div>

            {/* Botón de Cancelar con animaciones */}
            <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/doctores")}
              >
                Cancelar
              </Button>
            </motion.div>
          </form>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default AgregarDoctor;
