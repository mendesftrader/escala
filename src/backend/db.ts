//Arquivo para fazer a conexão com o banco de dados, sempre salvar este arquivo como ts e não tsx
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Daniel1992*",
  database: "escala",
});

export default pool;