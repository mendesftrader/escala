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
import theme from "../../theme/layout";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";


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
  motivo: string;
  unidade: string;
}

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
        const resposta = await axios.get<Militar[]>("/api/inativo"); // tipagem no axios, nunca esqueça a tipagem, faça o teste da rota no navegador(metodo simples)
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

  //renderiza a tabela do banco de dados por escala, importante ordenar pelo ultimo serviço
  const renderTabelaPorPosto = (postosArray: string[]) => {
    const militaresFiltrados = militares.filter((m) => postosArray.includes(m.posto))
    .sort((a, b) => {
      if (!a.ultimo_servico) return -1;
      if (!b.ultimo_servico) return 1;

      return a.ultimo_servico.localeCompare(b.ultimo_servico);
    });
    
    return (
      <Box sx={{width: "100%" }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" width={250} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }} >Nome</TableCell>
                <TableCell align="center" width={90} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Posto </TableCell>
                <TableCell align="center" width={100} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Escala</TableCell>
                <TableCell align="center" width={70} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Último Serviço</TableCell>
                <TableCell align="center" width={50} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Status</TableCell>
                <TableCell align="center" width={100} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Motivo</TableCell>
                <TableCell align="center" width={100} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Unidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {militaresFiltrados.map((m) => (
                <TableRow key={m.id_militar}>
                    <TableCell align="center" sx={{ border: '2px solid' }}>{m.nome}</TableCell>
                    <TableCell align="center" sx={{ border: '2px solid' }}>{m.posto}</TableCell>
                    <TableCell align="center" sx={{ border: '2px solid' }}>{m.escala}</TableCell>
                    <TableCell align="center" sx={{ border: '2px solid' }}>
                    {m.ultimo_servico
                        ? m.ultimo_servico.slice(0, 10).split("-").reverse().join("/")
                        : "-"}
                    </TableCell>
                    <TableCell align="center" sx={{ border: '2px solid' }}>{m.status}</TableCell>
                    <TableCell align="center" sx={{ border: '2px solid' }}>{m.motivo}</TableCell>
                    <TableCell align="center" sx={{ border: '2px solid' }}>{m.unidade}</TableCell>
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
      <Box
       sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}
      > 
        <Header />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            background: "linear-gradient(10deg, #d3c125, #96948d)",
            flex: 1
          }}
        >
          <Typography variant="body1" sx={{ fontSize: 60, fontStyle: "italic", marginTop:4}}>
              Militares Fora da Escala de Serviço
          </Typography>
          {/* Accordion por categoria */}
          <Box sx={{ width: "80%", marginTop: 5, marginBottom: 5 }}>
            {/* Inativos */}
            {(() => {
              const oficialDia = ["1º Tenente", "2º Tenente", "Aspirante a Oficial"];
              const adjunto = ["1º Sargento", "2º Sargento"];
              const terceiroSargento = ["3º Sargento"];
              const count1 = militares.filter((m) => oficialDia.includes(m.posto)).length;
              const count2 = militares.filter((m) => adjunto.includes(m.posto)).length;
              const count3 = militares.filter((m) => terceiroSargento.includes(m.posto)).length;

              return (
                  <Accordion expanded={true} sx={{ backgroundColor: "#6d6969c7", position:"relative"}}>
                      <AccordionSummary > {/*ícone para fechar o accordion se necessário usar => expandIcon={<ExpandMoreIcon />} */}
                      </AccordionSummary>
                          <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>
                            Militares que concorrem a escala de Oficial de Dia ({count1})
                          </Typography>
                      <AccordionDetails>{renderTabelaPorPosto(oficialDia)}</AccordionDetails>
                          <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>
                            Militares que concorrem a escala de Adjunto ao Oficial de Dia ({count2})
                          </Typography>
                      <AccordionDetails>{renderTabelaPorPosto(adjunto)}</AccordionDetails>
                          <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>
                            Militares que concorrem a escala de Comandante da Guarda ({count3})
                          </Typography>
                      <AccordionDetails>{renderTabelaPorPosto(terceiroSargento)}</AccordionDetails>
                  </Accordion>
              );
            })()}
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}