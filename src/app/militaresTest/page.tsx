"use client"; //componente executado do lado do cliente

import { useState, useEffect } from "react";
//usestate cria os estados e usefffect executa o coódigo ao carregar
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // usar para mostrar que o accordion está aberto
import Image from "next/image";
import theme from "../../theme/layout";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";


//tipagem necessária para o typeScript
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
}

export default function MilitaresPage() { //componente principal
  const Theme = theme;

  const [militares, setMilitares] = useState<Militar[]>([]); //estado que guarda todos os militares
  const [editMilitar, setEditMilitar] = useState<Militar | null>(null); //estado do militar que está sendo editado
  const [expanded, setExpanded] = useState<string | false>(false);// estado que controla qual accordion está aberto

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

  const status = ["ATIVO", "INATIVO"] as const;

  // carrega os dados do back
  const carregarMilitares = async () => {
    try {
      const resposta = await axios.get<Militar[]>("/api/militares");
      setMilitares(resposta.data);
      console.log(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  //carrega os itens do acordion revisar depois
  useEffect(() => {
    const fetchData = async () => {
      await carregarMilitares();
    };
    fetchData();
  }, []);

  //qual accordion está aberto
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  //abre modal de edição e configura a data pra não gerar erro no BD
  const handleEditClick = (militar: Militar) => {
    setEditMilitar({
      ...militar,
      dataPraca: militar.dataPraca
        ? new Date(militar.dataPraca).toISOString().slice(0, 10)
        : "",
      ultimo_servico: militar.ultimo_servico
        ? new Date(militar.ultimo_servico).toISOString().slice(0, 10)
        : null,
    });
  };

  //alva alterações
  const handleSave = async () => {
    if (!editMilitar) return; //significa se não tiver militar para editar pare a funçaõ
    try {
      await axios.put(`/api/militares/${editMilitar.id_militar}`, editMilitar); //envia os dados para o BD
      await carregarMilitares(); // chama a função após a atualização
      setEditMilitar(null); //muda o estado do militar editado
    } catch (error) {
      console.error("Erro ao salvar alterações", error);
      alert("Erro ao atualizar militar.");
    }
  };

  //deleta o militar escolhido
  const handleDelete = async (id:number) => {
    if(!id) return; //não inicializa a função se não tiver nada a deletar
    try{
      await axios.delete(`/api/militares/${id}`)
      setMilitares(prev => prev.filter(m => m.id_militar !== id));
    }catch{
      alert("Erro ao excluir o militar.");
    }
  };

  //cria a tabela
  const renderTabelaPorPosto = (postosArray: string[]) => {
    const militaresFiltrados = militares.filter((m) =>
      postosArray.includes(m.posto)
    );

    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", my: 2 }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nome</TableCell>
                <TableCell align="center">Posto</TableCell>
                <TableCell align="center">Identidade</TableCell>
                <TableCell align="center">Data de Praça</TableCell>
                <TableCell align="center">Escala</TableCell>
                <TableCell align="center">Último Serviço</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {militaresFiltrados.map((m) => (
                <TableRow key={m.id_militar}>
                  <TableCell align="center">{m.nome}</TableCell>
                  <TableCell align="center">{m.posto}</TableCell>
                  <TableCell align="center">{m.identidade}</TableCell>
                  <TableCell align="center">
                    {new Date(m.dataPraca).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell align="center">{m.escala}</TableCell>
                  <TableCell align="center">
                    {m.ultimo_servico
                      ? new Date(m.ultimo_servico).toLocaleDateString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">{m.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEditClick(m)}
                      sx={{ m: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(m.id_militar)}
                    >
                      Excluir
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

  return (
    <ThemeProvider theme={Theme}>
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

        <Box sx={{ width: "80%", mx: "auto" }}>
          {(() => {
            const postosOficialDia = [
              "1º Tenente",
              "2º Tenente",
              "Aspirante a Oficial",
            ];

            const count = militares.filter((m) =>
              postosOficialDia.includes(m.posto)
            ).length;

            return (
              <Accordion
                expanded={expanded === "oficialDia"}
                onChange={handleAccordionChange("oficialDia")}
                sx={{ backgroundColor: "#6d6969c7" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    MILITARES QUE CONCORREM A ESCALA DE OFICIAL DE DIA ({count})
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  {renderTabelaPorPosto(postosOficialDia)}
                </AccordionDetails>
              </Accordion>
            );
          })()}
        </Box>

        <Box sx={{ width: "80%", mx: "auto", padding: 2 }}>
          {(() => {
            const postoAdjunto = [
              "2º Sargento",
              "1º Sargento",
            ];

            const count = militares.filter((m) =>
              postoAdjunto.includes(m.posto)
            ).length;

            return (
              <Accordion
                expanded={expanded === "postoAdjunto"}
                onChange={handleAccordionChange("postoAdjunto")}
                sx={{ backgroundColor: "#6d6969c7" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    MILITARES QUE CONCORREM A ESCALA DE OFICIAL DE DIA ({count})
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  {renderTabelaPorPosto(postoAdjunto)}
                </AccordionDetails>
              </Accordion>
            );
          })()}
        </Box>  

        <Box sx={{ width: "80%", mx: "auto" }}>
          {(() => {
            const postoSgtdia = [
              "3º Sargento",
            ];

            const count = militares.filter((m) =>
              postoSgtdia.includes(m.posto)
            ).length;

            return (
              <Accordion
                expanded={expanded === "postoSgtdia"}
                onChange={handleAccordionChange("postoSgtdia")}
                sx={{ backgroundColor: "#6d6969c7" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    MILITARES QUE CONCORREM A ESCALA DE OFICIAL DE DIA ({count})
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  {renderTabelaPorPosto(postoSgtdia)}
                </AccordionDetails>
              </Accordion>
            );
          })()}
        </Box>

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
              label="Posto"
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
              margin="dense"
              value={editMilitar?.ultimo_servico || ""}
              onChange={(e) =>
                setEditMilitar({
                  ...editMilitar!,
                  ultimo_servico: e.target.value,
                })
              }
            />
            <TextField
              label="Status"
              fullWidth
              select
              margin="dense"
              value={editMilitar?.status || ""}
              onChange={(e) =>
                setEditMilitar({
                  ...editMilitar!,
                  status: e.target.value as "ATIVO" | "INATIVO",
                })
              }
            >
              {status.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setEditMilitar(null)}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}