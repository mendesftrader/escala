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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
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
  const [editMilitar, setEditMilitar] = useState<Militar | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false); //deixa um accorion aberto por vez

  const postos = [
    "Soldado",
    "Cabo",
    "3º Sargento",
    "2º Sargento",
    "1º Sargento",
    "Aspirante a Oficial",
    "2º Tenente",
    "1º Tenente",
  ];

  const escala = [
    "Oficial de Dia",
    "Adjunto ao Oficial de Dia",
    "Sargento de Dia",
    "Comandante da Guarda",
  ];

  const unidades = [
    "18º BTrnp",
    "9º B Mnt",
    "Cia Cmd 9º Gpt Log",
    "9º B Sau",
  ]

  const status = ["ATIVO", "INATIVO"] as const;

  const motivo = [
    "Apresentado",
    "Curso",
    "Dispensa Médica",
    "Férias",
    "Instrução",
    "Licença Paternidade",
    "Licença Maternidade",
    "Missão fora da OM",
    "Operação",
    "outros"
  ]

 //carrega os dados do backend
  useEffect(() => {
    async function carregarMilitares() {
      try {
        const resposta = await axios.get<Militar[]>("/api/militares"); // tipagem no axios, nunca esqueça a tipagem, faça o teste da rota no navegador(metodo simples)
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

  //modal de edição//
  //configura a data para não gerar erro com o banco de dados
  const handleEditClick = (militar: Militar) => {
    setEditMilitar({
      ...militar,
      dataPraca: militar.dataPraca
        ? militar.dataPraca.slice(0, 10)
        : "",
      ultimo_servico: militar.ultimo_servico
        ? militar.ultimo_servico.slice(0, 10)
        : null,
    });
  };

  // salva as alterações feitas pelo admin
  const handleSave = async () => {
    if (!editMilitar) return;
    const militarEditado = editMilitar;
    // salva estado antigo
    const antigo = militares;
    // atualiza na tela do usuário automaticamente
    setMilitares((prev) =>
      prev.map((m) =>
        m.id_militar === militarEditado.id_militar
          ? militarEditado
          : m
      )
    );
    setEditMilitar(null);
    try {
      await axios.put(
        `/api/militares/${militarEditado.id_militar}`,
        militarEditado
      );
      await fetch("/api/previsao");//necessário para atualizar a escala após alguma atualização
      alert("Escala atualizada com sucesso")
    } catch (error) {
      console.error("Erro ao salvar alterações", error);
      setMilitares(antigo);
      alert("Erro ao atualizar militar.");
    }
  };

  //controla os acordions abertos
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };
  
  //Renderiza a tabela do banco de dados por escala
  //organiza por data de praça
  const renderTabelaPorPosto = (postosArray: string[]) => {
    const militaresFiltrados = militares.filter((m) => postosArray.includes(m.posto))
    .sort((a, b) => {
      if (!a.dataPraca) return -1;
      if (!b.dataPraca) return 1;

      return a.dataPraca.localeCompare(b.dataPraca);
    });
    
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", my: 2 }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" width={250} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Nome</TableCell>
                <TableCell align="center" width={180} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Posto</TableCell>
                <TableCell align="center" width={100} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Identidade</TableCell>
                <TableCell align="center" width={80} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Data de Praça</TableCell>
                <TableCell align="center" width={250} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Escala</TableCell>
                <TableCell align="center" width={80} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Último Serviço</TableCell>
                <TableCell align="center" width={60} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Status</TableCell>
                <TableCell align="center" width={100} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Motivo</TableCell>
                <TableCell align="center" width={180} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Unidade</TableCell>
                <TableCell align="center" width={250} sx={{ border: '2px solid', fontWeight:"bold", backgroundColor:"#a6ca2249" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {militaresFiltrados.map((m) => (
                <TableRow key={m.id_militar}>
                  <TableCell align="center" width={250} sx={{ border: '2px solid' }}>{m.nome}</TableCell>
                  <TableCell align="center" width={180} sx={{ border: '2px solid' }}>{m.posto}</TableCell>
                  <TableCell align="center" width={100} sx={{ border: '2px solid' }}>{m.identidade}</TableCell>
                  <TableCell align="center" width={80} sx={{ border: '2px solid' }}>
                    {m.dataPraca ? m.dataPraca.slice(0, 10).split("-").reverse().join("/") : "-"}
                  </TableCell>
                  <TableCell align="center" width={250} sx={{ border: '2px solid' }}>{m.escala}</TableCell>
                  <TableCell align="center" width={80} sx={{ border: '2px solid' }}>
                    {m.ultimo_servico
                      ? m.ultimo_servico.slice(0, 10).split("-").reverse().join("/") : "-"}
                  </TableCell>
                  <TableCell align="center" width={60} sx={{ border: '2px solid' }}>{m.status}</TableCell>
                  <TableCell align="center" width={100} sx={{ border: '2px solid' }}>{m.motivo}</TableCell>
                  <TableCell align="center" width={180} sx={{ border: '2px solid' }}>{m.unidade}</TableCell>
                  <TableCell align="center" width={250} sx={{ border: '2px solid' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleEditClick(m)}
                      sx={{ border:"2px solid", backgroundColor:"blueviolet", width:150}}
                    >
                      Editar
                    </Button>
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
          <Typography sx={{ fontSize: 40, fontStyle: "italic", marginTop: 10 }}>
            18º Batalhão de Transporte
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", height: "35vh" }}>
            <Image src="/image.png" alt="Logo" width={250} height={300} />
          </Box>
          <Typography sx={{ fontSize: 40, fontStyle: "italic" }}>
            A logística em movimento
          </Typography>

          {/* Accordion por categoria */}
          <Box sx={{ width: "80%", mx: "auto", marginBottom:4 }}>
            {/* Oficial de Dia */}
            {(() => {
              const postosOficialDia = ["1º Tenente", "2º Tenente", "Aspirante a Oficial"];
              const count = militares.filter((m) => postosOficialDia.includes(m.posto)).length;
              return (
                <Accordion 
                  sx={{ backgroundColor: "#6d6969c7" }} 
                  expanded={expanded === "postosOficialDia"}
                  onChange={handleChange("postosOficialDia")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      MILITARES QUE CONCORREM A ESCALA DE OFICIAL DE DIA ({count})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTabelaPorPosto(postosOficialDia)}</AccordionDetails>
                </Accordion>
              );
            })()}

            {/* Adjunto ao Oficial de Dia */}
            {(() => {
              const postosAdjunto = ["1º Sargento", "2º Sargento"];
              const count = militares.filter((m) => postosAdjunto.includes(m.posto)).length;
              return (
                  <Accordion 
                    sx={{ backgroundColor: "#6d6969c7" }} 
                    expanded={expanded === "postosAdjunto"}
                    onChange={handleChange("postosAdjunto")}
                  >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      MILITARES QUE CONCORREM A ESCALA DE ADJUNTO AO OFICIAL DE DIA ({count})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTabelaPorPosto(postosAdjunto)}</AccordionDetails>
                </Accordion>
              );
            })()}

            {/* Comandante da guarda */}
            {(() => {
              const postosSargento = ["3º Sargento"];
              const count = militares.filter((m) => postosSargento.includes(m.posto)).length;
              return (
                  <Accordion 
                    sx={{ backgroundColor: "#6d6969c7" }} 
                    expanded={expanded === "postosSargento"}
                    onChange={handleChange("postosSargento")}
                  >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      MILITARES QUE CONCORREM A ESCALA DE COMANDANTE DA GUARDA ({count})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTabelaPorPosto(postosSargento)}</AccordionDetails>
                </Accordion>
              );
            })()}
          </Box>

          {/* Modal de edição */}
          <Dialog open={!!editMilitar} onClose={() => setEditMilitar(null)}>
            <DialogTitle>Editar Militar</DialogTitle>
            <DialogContent>
              <TextField
                label="Nome"
                fullWidth
                margin="dense"
                value={editMilitar?.nome || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, nome: e.target.value })
                }
              />
              <TextField
                label="Posto/Grad"
                fullWidth
                margin="dense"
                select
                value={editMilitar?.posto || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, posto: e.target.value })
                }
              >
                {postos.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Identidade"
                fullWidth
                margin="dense"
                value={editMilitar?.identidade || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, identidade: e.target.value })
                }
              />
              <TextField
                label="Data Praça"
                type="date"
                fullWidth
                margin="dense"
                value={editMilitar?.dataPraca?.slice(0, 10) || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, dataPraca: e.target.value })
                }
              />
              <TextField
                label="Escala"
                fullWidth
                select
                margin="dense"
                value={editMilitar?.escala || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, escala: e.target.value })
                }
              >
                {escala.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Último Serviço"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={editMilitar?.ultimo_servico || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, ultimo_servico: e.target.value })
                }
              />
              <TextField
                label="Status"
                fullWidth
                select
                margin="dense"
                value={editMilitar?.status || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, status: e.target.value as "ATIVO" | "INATIVO" })
                }
              >
                {status.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Motivo"
                fullWidth
                select
                margin="dense"
                value={editMilitar?.motivo || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, motivo: e.target.value })
                }
              >
                {motivo.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Unidade"
                fullWidth
                margin="dense"
                select
                value={editMilitar?.unidade || ""}
                onChange={(e) =>
                  setEditMilitar({ ...editMilitar!, unidade: e.target.value })
                }
              >
                {unidades.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="error" onClick={() => setEditMilitar(null)}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}