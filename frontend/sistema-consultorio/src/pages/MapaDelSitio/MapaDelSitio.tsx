import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { motion } from "framer-motion";

const MapaDelSitio = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          🗺️ Mapa del Sitio
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="🏠 Dashboard Principal" secondary="/dashboard" />
          </ListItem>

          <ListItem>
            <ListItemText primary="📅 Gestión de Citas" secondary="/citas" />
          </ListItem>

          <ListItem>
            <ListItemText primary="🩺 Doctores Registrados" secondary="/doctores" />
          </ListItem>

          <ListItem>
            <ListItemText primary="👥 Pacientes Registrados" secondary="/pacientes" />
          </ListItem>

          <ListItem>
            <ListItemText primary="🏥 Departamentos" secondary="/departamentos" />
          </ListItem>

          <ListItem>
            <ListItemText primary="📍 Farmacias Cercanas" secondary="Botón dentro de /dashboard" />
          </ListItem>

          <ListItem>
            <ListItemText primary="📆 Verificar Calendario de Citas" secondary="Modal dentro de /dashboard" />
          </ListItem>

          <ListItem>
            <ListItemText primary="🧪 Crear Cita" secondary="/crear-citas" />
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText primary="🔐 Iniciar Sesión" secondary="/login" />
          </ListItem>

          <ListItem>
            <ListItemText primary="🔓 Cerrar Sesión" secondary="Botón dentro de cualquier sección" />
          </ListItem>

          <ListItem>
            <ListItemText primary="🔄 Recuperar Contraseña" secondary="/recuperar" />
          </ListItem>

          <ListItem>
            <ListItemText primary="❓ Página no encontrada" secondary="Cualquier ruta inválida muestra /404" />
          </ListItem>
        </List>
      </Box>
    </motion.div>
  );
};

export default MapaDelSitio;
