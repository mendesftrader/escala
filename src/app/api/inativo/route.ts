//rota backend para exibir os militares inativos
import { NextResponse } from "next/server";
import db from "../../../backend/db";


// GET-geral, para obter dados
export async function GET( ){
  try{
      const [militares] = await db.query(
        `SELECT 
        id_militar, 
        nome, 
        posto, 
        escala, 
        ultimo_servico,       
        status,
        unidade
        FROM militares
        WHERE status = 'INATIVO'
        ORDER BY ultimo_servico ASC
        `
      );
      return NextResponse.json(militares);
  }catch(error){
      console.error("Erro ao buscar militar", error);
      return NextResponse.json({error: "Erro ao buscar miliatres"}, {status: 500});
  }
}