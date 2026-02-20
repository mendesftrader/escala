import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";

// POST → cadastrar usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, posto, identidade, senha, dataPraca, escala } = body;

    // Validação simples
    if (!nome || !posto || !identidade || !senha || !dataPraca || !escala) {
      return NextResponse.json(
        { sucesso: false, erro: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Inserir no banco
    const [result] = await pool.query(
        "INSERT INTO militares (nome, posto, identidade, senha, dataPraca, escala, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nome, posto, identidade, senha, dataPraca, escala, "ATIVO"]
    );

    return NextResponse.json({
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso",
      resultado: result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao cadastrar usuário" },
      { status: 500 }
    );
  }
}