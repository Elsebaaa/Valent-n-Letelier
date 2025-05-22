import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ← pon tu clave si la configuraste en MySQL
  database: 'valentin_letelier',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
