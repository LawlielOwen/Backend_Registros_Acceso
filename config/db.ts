import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 4, // <-- Ideal para Clever Cloud
  ssl: {
    rejectUnauthorized: false // <-- Permite la conexión segura
  },
  // ==========================================
  // LA MAGIA PARA EL HORARIO:
  // ==========================================
  timezone: '-06:00', // Obliga a MySQL a usar el horario local
  dateStrings: true   // Evita que Node.js convierta las fechas a formato UTC
});

export default pool;
 
