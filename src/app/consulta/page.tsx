"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
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

interface Escala {
  id: number;
  id_militar: number;
  data: string;
  tipo_dia: string;
  escala: string;
  nome: string;
  posto: string;
  unidade: string;
  observacao: string;
}

export default function HistoricoPage() {
  const Theme = theme;
  const [dados, setDados] = useState<Escala[]>([]);
  const [loading, setLoading] = useState(false);
  const [unidade, setUnidade] = useState("");
  const [escala, setEscala] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [buscou, setBuscou] = useState(false);
  const [lancamentos, setLancamentos] = useState<{ [key: number]: string }>({});
  
  const buscarDados = async () => {
    try {
      setLoading(true);
      setBuscou(true); 
      const res = await axios.get("/api/consulta_historico", {
        params: {
          unidade,
          escala,
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
          <Typography sx={{ fontSize: 40, fontStyle: "normal", mb: 3 }}>
            Consultar Escalas
          </Typography>

          {/*Filtros */}
          <Paper sx={{ p: 2, width: "80%", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Unidade"
                select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                sx={{ flex: 1 }}
              >
                <MenuItem value="18º BTrnp">18º BTrnp</MenuItem>
                <MenuItem value="9º B Mnt">9º B Mnt</MenuItem>
                <MenuItem value="Cia Cmd 9º Gpt Log">Cia Cmd 9º Gpt Log</MenuItem>
                <MenuItem value="9º B Sau">9º B Sau</MenuItem>
              </TextField>

              <TextField
                label="Escala"
                select
                value={escala}
                onChange={(e) => setEscala(e.target.value)}
                sx={{ flex: 1 }}
              >
                <MenuItem value="Oficial de Dia">Oficial de Dia</MenuItem>
                <MenuItem value="Adjunto ao Oficial de Dia">
                  Adjunto ao Oficial de Dia
                </MenuItem>
                <MenuItem value="Comandante da Guarda">Comandante da Guarda</MenuItem>
              </TextField>

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
                InputLabelProps={{ shrink: true }} //encolhe o label
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Paper>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", margin:4 }}>
            <Button variant="contained" onClick={buscarDados} sx={{width:200, border: '2px solid', backgroundColor:"blueviolet"}}>
              Consultar
            </Button>
          </Box>
          
          {loading && <Typography>Carregando...</Typography>}
          <Box sx={{ width: "95%", mb: 2 }}>
            <Accordion  expanded>
              <AccordionSummary>
                <Typography sx={{ fontWeight: "bold" }}>
                  Resultado da Pesquisa ({dados.length})
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" width={300} sx={{ border: '2px solid' }}>Nome</TableCell>
                        <TableCell align="center" width={150} sx={{ border: '2px solid' }}>Posto</TableCell>
                        <TableCell align="center" width={150} sx={{ border: '2px solid' }}>Escala</TableCell>
                        <TableCell align="center" width={75} sx={{ border: '2px solid' }}>Data</TableCell>
                        <TableCell align="center" width={150} sx={{ border: '2px solid' }}>Tipo Dia</TableCell>
                        <TableCell align="center" width={150} sx={{ border: '2px solid' }}>Unidade</TableCell>
                        <TableCell align="center" width={150} sx={{ border: '2px solid' }}>Fatos lançados</TableCell>
                        <TableCell align="center" width={350} sx={{ border: '2px solid' }}>Alterações da Escala</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {!buscou ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center"> {/*colspan faz uma celula ocupar uma quantidade celulas desejada, como um mesclar*/}
                              Use os filtros e clique em Consultar para visualizar os dados
                            </TableCell>
                          </TableRow>
                        ) : dados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ border: '2px solid' }}>
                              Nenhum resultado encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                        dados.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell align="center" width={300} sx={{ border: '2px solid' }}>{item.nome}</TableCell>
                            <TableCell align="center" width={150} sx={{ border: '2px solid' }}>{item.posto}</TableCell>
                            <TableCell align="center" width={150} sx={{ border: '2px solid' }}>{item.escala}</TableCell>
                            <TableCell align="center" width={150} sx={{ border: '2px solid' }}>
                              {new Date(item.data).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell align="center" width={75} sx={{ border: '2px solid' }}>{item.tipo_dia}</TableCell>
                            <TableCell align="center" width={150} sx={{ border: '2px solid' }}>{item.unidade}</TableCell>
                            <TableCell align="center" width={350} sx={{ border: '2px solid' }}>{item.observacao}</TableCell>
                            <TableCell align="center" width={150} sx={{ border: '2px solid' }}>
                              <TextField
                                sx={{ border: '2px solid', borderRadius:2}}
                                value={lancamentos[item.id] || ""}
                                size="small"
                                placeholder="Informe aqui as alterações ocorridas"
                                fullWidth
                                onChange={(e) => {
                                  setLancamentos({
                                    ...lancamentos,
                                    [item.id]: e.target.value,
                                  });
                                }}
                              />
                              <Button
                                sx={{ border: '2px solid', backgroundColor:"blueviolet", marginTop:2}}
                                variant="contained"
                                onClick={async () => {
                                  const texto = lancamentos[item.id];
                                  if (!texto) return;
                                  try {
                                    await axios.post("/api/salvar_observacao", {
                                      id: item.id,
                                      data: item.data,
                                      fato: texto,
                                    });
                                    //limpa o campo apos salvar
                                    setLancamentos((prev) => ({
                                      ...prev,
                                      [item.id]: "",
                                    }));
                                    //atualiza a tabela
                                    await buscarDados();
                                  } catch (err) {
                                    console.error(err);
                                    alert("Erro ao salvar");
                                  }
                                }}
                              >
                                Salvar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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