import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import React from 'react';


// Definir una interfaz para las farmacias
interface Pharmacy {
  lat: number;
  lon: number;
  tags?: {
    name?: string;
  };
}

// Definir un ícono personalizado para farmacias
const pharmacyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3916/3916651.png",
  iconSize: [30, 30],
});

const CityPharmacyMap = () => {
  // ✅ Usar useMemo para memorizar las coordenadas
  const cityCoords = useMemo(() => [25.1890, -99.8280] as [number, number], []);

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  useEffect(() => {
    const fetchPharmacies = async () => {
      const query = `
        [out:json];
        node["amenity"="pharmacy"](around:5000,${cityCoords[0]},${cityCoords[1]});
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await axios.get(url);
        setPharmacies(response.data.elements as Pharmacy[]);
      } catch (error) {
        console.error("Error al obtener las farmacias:", error);
      }
    };

    fetchPharmacies();
  }, [cityCoords]); // ✅ cityCoords ya está memorizado, por lo que no se vuelve a crear

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Typography variant="h4" sx={{ textAlign: "center", margin: 2 }}>
        Farmacias Cercanas en Montemorelos, Nuevo León
      </Typography>

      <MapContainer
        center={cityCoords}
        zoom={13}
        style={{ height: "500px", width: "100%" }} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Mostrar las farmacias en el mapa */}
        {pharmacies.map((pharmacy, index) => (
          <Marker
            key={index}
            position={[pharmacy.lat, pharmacy.lon] as [number, number]}
            icon={pharmacyIcon}
          >
            <Popup>{pharmacy.tags?.name || "Farmacia Desconocida"}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default CityPharmacyMap;
