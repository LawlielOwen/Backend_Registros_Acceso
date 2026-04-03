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
  connectionLimit: 4, // <-- Bajamos el límite para que Clever Cloud no lo bloquee
  ssl: {
    rejectUnauthorized: false // <-- Permite la conexión segura entre Render y Clever Cloud
  }
});

export default pool;