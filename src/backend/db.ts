//Arquivo para fazer a conexão com o banco de dados, sempre salvar este arquivo como ts e não tsx
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;

//não esquecer de proteger os acessos ao BD no env