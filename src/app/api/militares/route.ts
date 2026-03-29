//rota GET e PUT
import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";
import db from "../../../backend/db";
import bcrypt from "bcryptjs";

// POST criar usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, posto, identidade, senha, dataPraca, escala, motivo, unidade } = body;
    // Validação simples
    if (!nome || !posto || !identidade || !senha || !dataPraca || !escala || !motivo || !unidade) {
      return NextResponse.json(
        { sucesso: false, erro: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }
    //nivel do bcrypt
    const saltround = 3;
    //criar hash da senha
    const senhaHash = await bcrypt.hash(senha, saltround);
    // Inserir no banco
    const [result] = await pool.query(
      "INSERT INTO militares (nome, posto, identidade, senha, dataPraca, escala, status, motivo, unidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, posto, identidade, senhaHash, dataPraca, escala, "ATIVO", motivo, unidade]
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

// GET-geral, para obter dados
export async function GET( ){
  try{
      const [militares] = await db.query(
        `SELECT 
        id_militar, 
        nome, 
        posto, 
        identidade, 
        dataPraca,
        escala, 
        ultimo_servico,       
        status,
        motivo,
        unidade
        FROM militares
        ORDER BY dataPraca ASC
        `
      );
      return NextResponse.json(militares);
  }catch(error){
      console.error("Erro ao buscar militar", error);
      return NextResponse.json({error: "Erro ao buscar miliatres"}, {status: 500});
  }
}



