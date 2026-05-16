"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import theme from "../../theme/layout";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Escala {
  id: number;
  data: string;
  tipo_dia: string;
  escala: string;
  nome: string;
  posto: string;
  unidade: string;
  id_militar: number;
}

function montarTabela(dados: Escala[]) {
  const datas = [...new Set(dados.map(d => d.data))].sort();
  const escalasFixas = [
    "Oficial de Dia",
    "Adjunto ao Oficial de Dia",
    "Comandante da Guarda",
  ];

  const mapa: Record<string, Record<string, string[]>> = {};

  for (const esc of escalasFixas) {
    mapa[esc] = {};
  }

  for (const item of dados) {
    const label = `${item.posto} - ${item.nome}`;
    if (!mapa[item.escala]) continue;
    if (!mapa[item.escala][item.data]) {
      mapa[item.escala][item.data] = [];
    }
    mapa[item.escala][item.data].push(label);
  }

  return { datas, escalasFixas, mapa };
}

//gerar PDF da para melhorar
function gerarPDF(dados: Escala[]) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const view = montarTabela(dados);
  const head = [
    [
      "ESCALA",
      ...view.datas.map(d =>
        new Date(d).toLocaleDateString("pt-BR")
      ),
    ],
  ];

  const body = view.escalasFixas.map((escala) => {
    const row: any[] = [escala];
    view.datas.forEach((data) => {
      const militares = (view.mapa[escala]?.[data] || []).join("\n");
      row.push(militares || "-");
    });

    return row;
  });
  //permite formatar o PDF
  autoTable(doc, {
    head,
    body,
    startY: 20, 
    margin: {
      top: 20,
      left: 10,
      right: 10,
      bottom: 10,
    },
    styles: {
      halign: "center",//centraliza conteúdo
      valign: "middle",
      fontSize: 9,
      cellPadding: 3,
      lineWidth: 0.3,//borda das células
      lineColor: [0, 0, 0],
    },
    theme: "grid",
  });
  doc.save("Escala 18º Batalhão de Transporte.pdf");
}

export default function HistoricoPage() {
  const Theme = theme;
  const [dados, setDados] = useState<Escala[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // realziar consultas
  const buscarDados = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/consulta_escalaGerada", {
        params: {
          dataInicio,
          dataFim,
        },
      });
      setDados(res.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  // salva histórico
  const salvarHistorico = async () => {
    try {
      setLoading(true);
      await axios.post("/api/historico_escalas", {
        dados,
      });
      alert("Histórico salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar histórico", err);
    } finally {
      setLoading(false);
    }
  };

  const view = montarTabela(dados);

  return (
    <ThemeProvider theme={Theme}>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(10deg, #d3c125, #96948d)",
            pt: 4,
          }}
        >
          <Typography sx={{ fontSize: 40, mb: 3 }}>
            IMPRIMIR ESCALA POR PERÍODO
          </Typography>

          {/* FILTROS */}
          <Paper sx={{ p: 2, width: "25%", mb: 2, marginBottom: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Data Início"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                sx={{ flex: 1 }}
              />

              <TextField
                label="Data Fim"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Paper>

          {/* BOTÕES */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={buscarDados}
              sx={{width:200, border: '2px solid', backgroundColor:"blueviolet"}}
            >
              CONSULTAR ESCALA
            </Button>

            <Button
              variant="contained"
              onClick={salvarHistorico}
              disabled={dados.length === 0}
              sx={{width:200, border: '2px solid', backgroundColor:"blueviolet"}}
            >
              SALVAR
            </Button>

            <Button
              variant="contained"
              onClick={() => gerarPDF(dados)}
              disabled={dados.length === 0}
              sx={{width:200, border: '2px solid', backgroundColor:"blueviolet"}}
            >
              GERAR PDF
            </Button>
          </Box>

          {loading && <Typography>Carregando...</Typography>}

          {/* TABELA) */}
          <Box sx={{ width: "95%" }}>
            <Accordion expanded>
              <AccordionSummary sx={{ marginTop: 3 }}>
                <Typography fontWeight="bold">
                  Escala por Período
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" width={250} sx={{ border: '3px solid', fontWeight: "bold" }}>
                          ESCALA
                        </TableCell>
                        {view.datas.map((d) => (
                          <TableCell key={d} align="center" width={250} sx={{ border: '3px solid', fontWeight: "bold" }}>
                            {new Date(d).toLocaleDateString("pt-BR")}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {view.escalasFixas.map((escala) => (
                        <TableRow key={escala}>
                          <TableCell align="center" width={250} sx={{ border: '3px solid', fontWeight: "bold" }}>
                            {escala}
                          </TableCell>
                          {view.datas.map((data) => (
                            <TableCell key={data} align="center" width={250} sx={{ border: '3px solid', fontWeight: "bold" }}>
                              {(view.mapa[escala]?.[data] || []).map((m, i) => (
                                <div key={i}>{m}</div>
                              ))}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}