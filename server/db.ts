import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// TiDB Serverless用の接続プールを作成
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2' // TiDB Serverlessの必須要件
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;