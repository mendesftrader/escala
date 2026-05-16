//rota GET e PUT
import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";
import db from "../../../backend/db";


// POST criar usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); //converte o json enviado em JS
    const { nome, posto, identidade, dataPraca, escala, unidade } = body;
    // validação simples
    if (!nome || !posto || !identidade || !dataPraca || !escala || !unidade) {
      return NextResponse.json(
        { sucesso: false, erro: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }
    //a senha será inserida por outra rota
    const [result] = await pool.query(
      "INSERT INTO militares (nome, posto, identidade, senha, dataPraca, escala, status, unidade, primeiro_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, posto, identidade, null, dataPraca, escala, "ATIVO", unidade, true]
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

// GET-geral, para obter dados por antiguidade, ou seja o mais antigo primeiro
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
        unidade,
        primeiro_login
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



