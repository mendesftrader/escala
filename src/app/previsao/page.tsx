"use client";

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
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import theme from "../../theme/layout";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

//tipagem
interface Escala {
  data: string;
  escala: string;
  tipo_dia: string;
  nome: string;
  posto: string;
  unidade: string;
}

export default function MilitaresPage() {
  const Theme = theme;

  const [loading, setLoading] = useState(true);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  // buscar dados do backend
  useEffect(() => {
    async function carregarEscalas() {
      setLoading(true);
      try {
        const resposta = await axios.get<Escala[]>("/api/escalas");
        setEscalas(resposta.data);
        console.log(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    }

    carregarEscalas();
  }, []);

  if (loading) {
    return <p>Aguarde um momento...</p>;
  }

  const handleGerarEscala = async () =>{
    try{
      await fetch("/api/previsao");
      alert("Escala gerada com sucesso!")
    }catch(error){
      console.error("Erro ao Gerar a Escala", error);
      alert("Problemas ao gerar a escala")
    }
  }

  //controle do accordion
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  //monta a tabela por posto
  const renderTabelaPorPosto = (postosArray: string[]) => {
    const filtrados = escalas
      .filter((e) => postosArray.includes(e.posto))
      .sort((a, b) => a.data.localeCompare(b.data));

    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", my: 2 }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead >
              <TableRow >
                <TableCell align="center" width={200} sx={{ border: '2px solid',backgroundColor:"#a6ca2249", fontWeight:"bold" }}>Posto</TableCell>
                <TableCell align="center" width={300} sx={{ border: '2px solid',backgroundColor:"#a6ca2249", fontWeight:"bold" }}>Nome</TableCell>
                <TableCell align="center" width={180} sx={{ border: '2px solid',backgroundColor:"#a6ca2249", fontWeight:"bold" }}>Escala</TableCell>
                <TableCell align="center" width={80} sx={{ border: '2px solid',backgroundColor:"#a6ca2249", fontWeight:"bold" }}>Data</TableCell>
                <TableCell align="center" width={180} sx={{ border: '2px solid',backgroundColor:"#a6ca2249", fontWeight:"bold" }}>Tipo do Dia</TableCell>
                <TableCell align="center" width={90} sx={{ border: '2px solid',backgroundColor:"#a6ca2249", fontWeight:"bold" }}>Unidade</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtrados.map((e, index) => (
                <TableRow key={index}>
                  <TableCell align="center" width={200} sx={{ border: '2px solid' }}>{e.posto}</TableCell>
                  <TableCell align="center" width={300} sx={{ border: '2px solid' }}>{e.nome}</TableCell>
                  <TableCell align="center" width={180} sx={{ border: '2px solid' }}>{e.escala}</TableCell>
                  <TableCell align="center" width={80} sx={{ border: '2px solid' }}>
                    {new Date(e.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell align="center" width={180} sx={{ border: '2px solid' }}>{e.tipo_dia}</TableCell>
                  <TableCell align="center" width={90} sx={{ border: '2px solid' }}>{e.unidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

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
            flex: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            background: "linear-gradient(10deg, #d3c125, #96948d)",
            pt: 4,
          }}
        >
          <Typography sx={{ fontSize: 40, fontStyle: "italic", textAlign: "center", mt: 2 }}>
            18º Batalhão de Transporte
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Image src="/image.png" alt="Logo" width={250} height={300} />
          </Box>

          <Typography sx={{ fontSize: 40, fontStyle: "italic", textAlign: "center" }}>
            A logística em movimento
          </Typography>

          <Box sx={{ width: "80%", mx: "auto", marginBottom: 4 }}>
            {/* Oficial de Dia */}
            {(() => {
              const postos = ["1º Tenente", "2º Tenente", "Aspirante a Oficial"];
              return (
                <Accordion
                  sx={{ backgroundColor: "#6d6969c7" }}
                  expanded={expanded === "oficial"}
                  onChange={handleChange("oficial")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      ESCALA DE OFICIAL DE DIA 
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTabelaPorPosto(postos)}</AccordionDetails>
                </Accordion>
              );
            })()}
            {/* Adjunto */}
            {(() => {
              const postos = ["1º Sargento", "2º Sargento"];
              return (
                <Accordion
                  sx={{ backgroundColor: "#6d6969c7" }}
                  expanded={expanded === "adjunto"}
                  onChange={handleChange("adjunto")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: "bold" }}>
                       ESCALA DE ADJUNTO AO OFICIAL DE DIA 
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTabelaPorPosto(postos)}</AccordionDetails>
                </Accordion>
              );
            })()}
            {/* Sargento */}
            {(() => {
              const postos = ["3º Sargento"];
              return (
                <Accordion
                  sx={{ backgroundColor: "#6d6969c7" }}
                  expanded={expanded === "sargento"}
                  onChange={handleChange("sargento")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: "bold" }}>
                       ESCALA DE SARGENTO DE DIA 
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTabelaPorPosto(postos)}</AccordionDetails>
                </Accordion>
              );
            })()}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", my: 1 }}>
            <Button 
              variant="contained"
              onClick={() => handleGerarEscala( )}
              sx={{ border:"2px solid", backgroundColor:"blueviolet", width:150}}
            >
                Gerar Escala
            </Button>
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}