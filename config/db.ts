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
  connectionLimit: 4, 
  ssl: {
    rejectUnauthorized: false 
  },
 
  timezone: '-06:00',

});

pool.on('connection', (connection) => {

  connection.query("SET time_zone = '-06:00';").catch(err => {
    console.error("Error configurando la zona horaria en la conexión:", err);
  });
});

export default pool;