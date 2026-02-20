// salve esse arquivo sempre com o final ts e não tsx

import { NextResponse } from "next/server";
import pool from "@/backend/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT NOW() AS agora"); // se a conexão der certo retorna a data completa
    return NextResponse.json({ sucesso: true, resultado: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ sucesso: false, erro: "Erro ao conectar ao banco" });
  }
}