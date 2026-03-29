"use client"; // necessário para usar hooks

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import theme from "../../theme/layout";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Header from "../../components/Header";

//tipagaem, necessária para não dar erros no typescript
interface Militar {
  id: number;
  id_militar: number;
  nome: string;
  posto: string;
  identidade: string;
  dataPraca: string;
  escala: string;
  ultimo_servico?: string | null;
  status: "ATIVO" | "INATIVO";
  unidade: string;
}

const diasSemana = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

//cria a página e coloco o tema padrao
export default function MilitaresPage() {
  const Theme = theme;
  const [loading, setLoading] = useState(true);
  // estado com tipagem para evitar erros no typescript
  const [militares, setMilitares] = useState<Militar[]>([]);


 //carrega os dados do backend
  useEffect(() => {
    async function carregarMilitares() {
      try {
        const resposta = await axios.get<Militar[]>("/api/escala"); // tipagem no axios, nunca esqueça a tipagem, faça o teste da rota no navegador(metodo simples)
        setMilitares(resposta.data);
        console.log(resposta.data); //mostra no console os dados carregados
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally{
        setLoading(false);
      }
    };
    carregarMilitares();
  }, []);
  if (loading) {
    return <p>Carregando...</p>;
  }

  //Renderiza a tabela do banco de dados por escala
  const renderTabelaPorPosto = (postosArray: string[]) => {
    const militaresFiltrados = militares.filter((m) => postosArray.includes(m.posto))
    .sort((a, b) => {
      if (!a.ultimo_servico) return -1;
      if (!b.ultimo_servico) return 1;
      return a.ultimo_servico.localeCompare(b.ultimo_servico);
    });
    
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", my: 2 }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nome</TableCell>
                <TableCell align="center">Posto</TableCell>
                <TableCell align="center">Escala</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Unidade</TableCell>
                <TableCell align="center">Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {militaresFiltrados.map((m, index) => (
                <TableRow key={m.id_militar}>
                    <TableCell align="center">{m.nome}</TableCell>
                    <TableCell align="center">{m.posto}</TableCell>
                    <TableCell align="center">{m.escala}</TableCell>
                    <TableCell align="center">{m.status}</TableCell>
                    <TableCell align="center">{m.unidade}</TableCell>
                    <TableCell align="center">
                        {(() => {
                            const hoje = new Date();
                            const previsao = new Date(hoje);
                            previsao.setDate(previsao.getDate() + 1 + index);
                            const diaSemana = previsao.getDay();
                            const finalDeSemana = diaSemana === 0 || diaSemana === 6;
                            return (
                                <>
                                    {diasSemana[diaSemana]} - {previsao.toLocaleDateString("pt-BR")}
                                    {finalDeSemana && "Escala Vermelha"}
                                </>
                                );
                        })()}
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

 //montagem dos cpmponentes na página
  return (
    <ThemeProvider theme={Theme}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(10deg, #d3c125, #96948d)",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <Typography sx={{ fontSize: 40, fontStyle: "italic" }}>
          18º Batalhão de Transporte
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", height: "35vh" }}>
          <Image src="/image.png" alt="Logo" width={250} height={300} />
        </Box>
        <Typography sx={{ fontSize: 40, fontStyle: "italic" }}>
          A logística em movimento
        </Typography>

        {/* Accordion por mesclado */}
        <Box sx={{ width: "80%", mx: "auto" }}>
          {/* gera os nomes da escala */}
          {(() => {
            const escalaOficialDeDia = ["1º Tenente", "2º Tenente", "Aspirante a Oficial"];
            const escalaAdjunto = ["1º Sargento", "2º Sargento"];
            const escala3sargento = ["3º Sargento"];
            return (
              <Accordion sx={{ backgroundColor: "#6d6969c7" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: "bold" }}>
                  PREVISÃO DA ESCALA
                </Typography>
              </AccordionSummary>
              <AccordionDetails>{renderTabelaPorPosto( escalaOficialDeDia)  }</AccordionDetails>
              <AccordionDetails>{renderTabelaPorPosto( escalaAdjunto)}</AccordionDetails>
              <AccordionDetails>{renderTabelaPorPosto( escala3sargento)}</AccordionDetails>
              </Accordion>
            );
          })()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
