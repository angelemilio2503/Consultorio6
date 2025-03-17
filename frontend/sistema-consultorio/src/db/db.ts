import { Client } from 'pg';

// Configuración de la conexión a PostgreSQL
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",    // Cambia por tu usuario de PostgreSQL
  password: "1234",  // Cambia por tu contraseña
  database: "consultorio"  // Cambia por el nombre de tu base de datos
});

client.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión', err));

export default client;
