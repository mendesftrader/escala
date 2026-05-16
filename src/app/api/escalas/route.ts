import { NextResponse } from "next/server";
import db from "../../../backend/db";


// GET-geral, para obter dados da tabela escala
export async function GET( ){
  try{
      const [escalas] = await db.query(
        `SELECT 
        id,
        id_militar, 
        posto, 
        nome, 
        escala, 
        data,      
        tipo_dia,
        unidade
        FROM escalas
        WHERE data >= CURRENT_DATE 
        ORDER BY data ASC
        `
      );
      return NextResponse.json(escalas);
  }catch(error){
      console.error("Erro ao buscar militar", error);
      return NextResponse.json({error: "Erro ao buscar miliatres"}, {status: 500});
  }
}


