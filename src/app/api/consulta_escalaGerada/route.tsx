import { NextRequest, NextResponse } from "next/server";
import db from "@/backend/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url); //converte a URL em um objeto manipulável
    const unidade = searchParams.get("unidade");
    const escala = searchParams.get("escala");
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");

    //realiza a busca dos dados no BD
    let query = `
      SELECT 
        id,
        id_militar,
        nome,
        posto,
        escala,
        data,
        tipo_dia,
        unidade
      FROM escalas
      WHERE 1=1
    `;

    const params: any[] = [];

    // montagem dos filtros estrutura com If foi a única que funcionou
    if (unidade && unidade !== "") {
      query += " AND unidade = ?";
      params.push(unidade);
    }

    if (escala && escala !== "") {
      query += " AND escala = ?";
      params.push(escala);
    }

    if (dataInicio) {
      query += " AND data >= ?";
      params.push(dataInicio);
    }

    if (dataFim) {
      query += " AND data <= ?";
      params.push(dataFim);
    }

    query += " ORDER BY data ASC";

    const [dados]: any = await db.query(query, params);

    return NextResponse.json(dados);

  } catch (error) {
    console.error("Erro na consulta", error);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}