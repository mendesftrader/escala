// ROTA RESPONSAVEL POR REALIZAR A CONSULTA NA TABELA HISTÓRICO ESCALAS, USADO ROTA CONSULTAR_GERARESCALA COMO BASE, MESMA FUNÇÃO PRATICAMENTE

import { NextRequest, NextResponse } from "next/server";
import db from "@/backend/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const unidade = searchParams.get("unidade");
    const escala = searchParams.get("escala");
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");

    let query = `
      SELECT 
        id,
        nome,
        posto,
        escala,
        data,
        tipo_dia,
        unidade,
        observacao
      FROM historico_escalas
      WHERE 1=1
    `;

    const params: any[] = [];

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