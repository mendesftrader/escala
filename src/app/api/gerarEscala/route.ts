import { NextResponse } from "next/server";
import db from "../../../backend/db";

//Tipos de dia mais a frente poderá ser implementado um controle de pagamentos por serviços realizados em FDS ou Feriados
type CategoriaDia = "SEMANA" | "FIM_SEMANA" | "FERIADO";
const feriadosFixos = [
  "2026-01-01",
  "2026-04-21",
  "2026-05-01",
  "2026-09-07",
  "2026-10-12",
  "2026-11-02",
  "2026-11-15",
  "2026-12-25",
];

//função necessária para atualizar a data
function formatarData(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

//verifica se é dia de semana, DFS ou feriado
function getCategoriaDia(data: string): CategoriaDia {
  if (feriadosFixos.includes(data)) return "FERIADO";

  const [ano, mes, dia] = data.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  const diaSemana = d.getDay();

  return diaSemana === 0 || diaSemana === 6
    ? "FIM_SEMANA"
    : "SEMANA";
}

// ROTA POST => responsável por gerar a escala
export async function POST() {
  try {
    //pega o militar somente se o STATUS for ativo
    const [militares]: any = await db.query(`
      SELECT 
        id_militar,
        nome,
        posto,
        unidade,
        escala,
        ultimo_servico
      FROM militares
      WHERE status = 'ATIVO'
      ORDER BY 
        ultimo_servico IS NULL DESC,
        ultimo_servico ASC
    `);

    //quantidade de dias a gerar, pode ser mudado para que o usuário escolha a quantidade de dias, para o momento está ideal
    const dias = 30;

    //verifica quantas escalas existem, importante se for adicionar uma nova escala
    const escalasDisponiveis = [
      ...new Set(militares.map((m: any) => m.escala)),
    ];

    // cria um objeto para percorrer todas as escalas disponíveis
    const controleIndex: Record<string, number> = {};
    for (const escala of escalasDisponiveis) {
      controleIndex[escala] = 0;
    }

    //utliza a data de amanhã como base
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + 1);
    
    for (let i = 0; i < dias; i++) {

      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const data = formatarData(d);
      const tipoDia = getCategoriaDia(data);

      for (const escalaServico of escalasDisponiveis) {

        const militaresDaEscala = militares.filter(
          (m: any) => m.escala === escalaServico
        );

        if (militaresDaEscala.length === 0) continue;

        // não permite o mesmo serviço para a mesma escala com a mesma data
        const [existe]: any = await db.query(
          `SELECT id FROM escalas WHERE data = ? AND escala = ?`,
          [data, escalaServico]
        );

        if (existe.length > 0) {
          await db.query(
            `DELETE FROM escalas WHERE data = ? AND escala = ?`,
            [data, escalaServico]
          );
        }

        const index =
        controleIndex[escalaServico] % militaresDaEscala.length;
        const militar = militaresDaEscala[index];

        await db.query(
          `INSERT INTO escalas 
          (posto, nome, escala, data, tipo_dia, unidade, id_militar)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            militar.posto,
            militar.nome,
            escalaServico,
            data,
            tipoDia,
            militar.unidade,
            militar.id_militar
          ]
        );
        controleIndex[escalaServico]++;
      }
    }

    return NextResponse.json({
      message: "Escala gerada com sucesso",
      diasGerados: dias
    });
  } catch (error) {
    console.error("Erro ao gerar escala:", error);
    return NextResponse.json(
      { error: "Erro ao gerar escala" },
      { status: 500 }
    );
  }
}