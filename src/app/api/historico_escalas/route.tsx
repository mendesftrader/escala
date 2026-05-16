import { NextResponse } from "next/server";
import db from "../../../backend/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dados } = body;

    if (!dados || dados.length === 0) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    const amanhaStr = amanha.toISOString().split("T")[0];

    //faz com que apenas o futuro seja modificado, protegendo a integridade de dados passados
    await db.query(
      `DELETE FROM historico_escalas WHERE data >= ?`,
      [amanhaStr]
    );

    //parte importante, preenche a tabela com até o dia de amanhã, atualiza a tabela 
    // militares para que seja cálculado a folga do militar e a escala
    //se o militar nunca tirou serviço fica com a data NULL
    for (const item of dados) {
      const dataItem = new Date(item.data.split("T")[0]);
      const dataFormatada = item.data.split("T")[0];

      if (dataItem <= amanha) { // adicionado ADD CONSTRAINT unique_militar_data UNIQUE (id_militar, data); no banco de dados para evitar duplicidade
        await db.query(
          `INSERT INTO historico_escalas
          (id, id_militar, data, tipo_dia, escala, nome, posto, unidade) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          tipo_dia = VALUES(escala),
          escala = VALUES(escala),
          nome = VALUES(nome),
          posto = VALUES(posto),
          unidade = VALUES(unidade);
          `,
          [
            item.id,
            item.id_militar,
            dataFormatada,
            item.tipo_dia,
            item.escala,
            item.nome,
            item.posto,
            item.unidade,
          ]
        );
      }
    }
  
    //atualiza o campo ultimo serviço na tabela militares
    await db.query(`
    UPDATE militares m
      JOIN (
          SELECT 
            id_militar,
            MAX(data) AS ultima_data -- utlima_data é um alias, não confundir
          FROM historico_escalas
          WHERE data <= CURRENT_DATE
          GROUP BY id_militar
      ) h ON m.id_militar = h.id_militar
      SET m.ultimo_servico = 
        CASE
          WHEN m.ultimo_servico IS NULL THEN NULL
          WHEN h.ultima_data > m.ultimo_servico THEN h.ultima_data
          ELSE m.ultimo_servico
        END;
    `);

    return NextResponse.json({
      message: "Histórico atualizado (até amanhã, sem alterar passado)",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao salvar escala" },
      { status: 500 }
    );
  }
}