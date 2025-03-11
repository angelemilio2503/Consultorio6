import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const AñadirPaciente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    padecimientos: "",
    tipo_sangre: "",
    discapacidades: "",
    diagnostico: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos obligatorios
    const { nombre, edad, padecimientos, tipo_sangre, discapacidades, diagnostico } = formData;
    if (!nombre || !edad || !padecimientos || !tipo_sangre || !discapacidades || !diagnostico) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No tienes acceso. Inicia sesión.");
        setLoading(false);
        return;
      }

      // Realizar la solicitud POST
      await axios.post("http://localhost:3000/pacientes/agregar", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Paciente añadido exitosamente.");
      setTimeout(() => navigate("/pacientes"), 2000); // Redirige después de 2 segundos
    } catch  {
      setError("Error al añadir el paciente. Intenta nuevamente.");
    } finally {
      setLoading(false);
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "500px", borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>
            Añadir Nuevo Paciente
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              margin="normal"
              value={formData.nombre}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Edad"
              name="edad"
              type="number"
              margin="normal"
              value={formData.edad}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Padecimientos"
              name="padecimientos"
              margin="normal"
              value={formData.padecimientos}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Tipo de Sangre"
              name="tipo_sangre"
              margin="normal"
              value={formData.tipo_sangre}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Discapacidades"
              name="discapacidades"
              margin="normal"
              value={formData.discapacidades}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Diagnóstico"
              name="diagnostico"
              margin="normal"
              value={formData.diagnostico}
              onChange={handleChange}
            />

            <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Añadir Paciente"}
              </Button>
            </motion.div>

            {/* Botón para cancelar y volver */}
            <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/pacientes")}
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

export default AñadirPaciente;
