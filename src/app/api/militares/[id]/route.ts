// rotas por ID interessante para modificações por ID
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../backend/db";


//PUT 
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {id_militar, nome, identidade,  posto, dataPraca, escala, ultimo_servico, status, motivo, unidade } = body;
    // atualiza o valor no banco de dados
      await db.query(
        `UPDATE militares 
          SET nome = ?, identidade = ?, posto = ?, dataPraca = ?, escala = ?, ultimo_servico = ?, status = ?, motivo = ?, unidade = ?
          WHERE id_militar = ?`,
        [nome, identidade, posto, dataPraca, escala, ultimo_servico, status, motivo, unidade, id_militar]
      );
    return NextResponse.json(
      { message: "Usuário atualizado com sucesso" },
      { status: 200 }
    );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao atualizar usuário" },
        { status: 500 }
      );
  }
}
//DELETE rota não utilizada no momento, para fins de integridade 
// e poder sempre pesquisar quando um militar tirar serviço 
// é melhor apenas INATIVAR o usuário e manter seus dados salvos
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idNumber = Number(id);

    if (!idNumber) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    await db.execute(
      "DELETE FROM militares WHERE id_militar = ?",
      [idNumber]
    );
    return NextResponse.json({
      mensagem: "Militar deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar militar:", error);
    return NextResponse.json(
      { error: "Erro interno ao deletar militar" },
      { status: 500 }
    );
  }
}

