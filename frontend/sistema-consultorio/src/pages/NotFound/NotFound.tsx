import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f3f3f3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 4,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
        >
          Volver al Dashboard
        </Button>
      </motion.div>
    </Box>
  );
};

export default NotFound;
