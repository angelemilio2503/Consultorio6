import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
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

const CrearCitas = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fecha: "",
    paciente_id: "",
    doctor_id: "",
    motivo: "",
    estado: "Pendiente",
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

    const { fecha, paciente_id, doctor_id, motivo, estado } = formData;
    if (!fecha || !paciente_id || !doctor_id || !motivo || !estado) {
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

      await axios.post("http://localhost:3000/api/citas", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Cita creada exitosamente.");
      setTimeout(() => navigate("/citas"), 2000);
    } catch {
      setError("Error al crear la cita. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper elevation={3} sx={{ padding: 4, width: "500px", borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>
            Crear Nueva Cita
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Fecha y Hora"
              name="fecha"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.fecha}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="ID del Paciente"
              name="paciente_id"
              margin="normal"
              value={formData.paciente_id}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="ID del Doctor"
              name="doctor_id"
              margin="normal"
              value={formData.doctor_id}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Motivo de la Cita"
              name="motivo"
              margin="normal"
              value={formData.motivo}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              select
              label="Estado"
              name="estado"
              margin="normal"
              value={formData.estado}
              onChange={handleChange}
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Confirmada">Confirmada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Crear Cita"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/citas")}
            >
              Cancelar
            </Button>
          </form>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default CrearCitas;
