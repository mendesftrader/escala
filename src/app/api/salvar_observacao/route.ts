//rota para salvar as informações digitadas no campo Alterações da Escala
import { NextResponse } from "next/server";
import db from "../../../backend/db";

export async function POST(req: Request) {
  try {
    const { id, fato } = await req.json();

    await db.query(
      `
      UPDATE historico_escalas
      SET observacao = ?
      WHERE id = ?
      `,
      [fato, id]
    );

    return NextResponse.json({ message: "Observação salva" });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao salvar observação" },
      { status: 500 }
    );
  }
}