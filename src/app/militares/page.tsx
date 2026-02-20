// pagina para visualizar os militares cadastrados

"use client"; //Por utilizar hooks

import { useState, useEffect} from 'react';
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
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenuItem } from "@mui/material";
import Image from 'next/image'; //importa a imagem da pasta public
import theme from '../../theme/theme' // permite usar as cores do theme em todas as páginas
import {ThemeProvider} from "@mui/material/styles"; //necessário envolver todo o código para utilização do theme
import axios from "axios";

export default function Login ( ){
    const Theme = theme; //permite usar o theme dentro do ThemeProvider
    const[militares, setMilitares]=useState([]);
    const[editMilitar,  setEditMilitar]=useState([null]);

    const postos =[
        "Soldado",
        "Cabo",
        "3º Sgt Sargento",
        "2º Sgt Sargento",
        "1º Sgt Sargento",
        "Aspirante a Oficial",
        "2º Tenente",
        "1º Tenente",
    ];

    const escala = [
        "Oficial de Dia", 
        "Adjunto ao Oficial de Dia",
        "Sargento de Dia", 
        "Comandante da Guarda"
    ];

    const status = [
        "ATIVO", 
        "INATIVO"
    ];

    //formata a data para não haver conflito com o banco de dados
    const handleEditClick = (militar) => {
        setEditMilitar({
            ...militar,
            dataPraca: militar.dataPraca
                ? new Date(militar.dataPraca).toISOString().slice(0, 10)
                : "",
            ultimo_servico: militar.ultimo_servico
                ? new Date(militar.ultimo_servico).toISOString().slice(0, 10)
                : "",
        });
    };

    //função para atualizar a planilha após alteração
    useEffect(()=>{
        async function carregarMilitares( ) {
            try{
                const resposta = await axios.get('api aqui')
                setMilitares(resposta.data);
            }catch(error){
                console.error("Erro as carregar dados", error);
            }
        }
        carregarMilitares();
    },[]);

    // Rota para editar usuários //

    const handlesave = async () =>{
        try{
            const payload={
                ...editMilitar,
                ultimo_servico:editMilitar.ultimo_servico || null,
            };
            await axios.put('api aqui', payload);

            const resposta=await axios.get('api aqui');
            setMilitares(resposta.data);
            setEditMilitar(null);
        }catch(error){
            console.error("Erro ao tentar salvar alterações", error)
        }
    };

    // Rota para excluir usuários //

    const handleDelete = async (militar)=>{
        if (!militar) return;
        try{
            await axios.delete('Colocar a rota aqui');
            const resposta = await axios.get("rota a ser alterada")
            setMilitares(resposta.data);
        }catch(error){
            console.error("Erro ao deletar usuário", error);
        }
    };

    // Função que retorna a tabela filtrando por postos

    const renderTablePorPosto = (postosArray) =>{
        const militaresFiltrados = militares.filter((m) => postosArray.includes(m.posto));
        return(
            <Box
                sx={{ display:"flex", justifyContent: "center", width: "100%", my: 2}}
            >
                <TableContainer component={Paper} sx={{ width:"100%" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: 2 }} align="center">Nome</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Posto</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Identidade</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Data de Praça</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Escala</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Último Serviço</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Status</TableCell>
                                <TableCell sx={{ border: 2 }} align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {militaresFiltrados.map((m) => (
                                <TableRow key={m.identidade}>
                                    <TableCell sx={{ border: 2 }} align="center">{m.nome}</TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">{m.posto}</TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">{m.identidade}</TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">
                                        {new Date(m.dataPraca).toLocaleDateString("pt-BR")}
                                    </TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">{m.escala}</TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">
                                        {m.ultimo_servico
                                        ? new Date(m.ultimo_servico).toLocaleDateString("pt-BR")
                                        : "-"} {/*se nulo preenche o campo com um espaço */}
                                    </TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">{m.status}</TableCell>
                                    <TableCell sx={{ border: 2 }} align="center">
                                        <Button
                                        sx={{ border: 2, m: 1 }}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEditClick(m)}
                                        >
                                        Editar
                                        </Button>
                                        <Button
                                        sx={{ border: 2 }}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            if (window.confirm(`Tem certeza que deseja excluir o militar ${m.nome}?`)) {
                                            handleDelete(m);
                                            }
                                        }}
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
        )
    };

    return(
        <ThemeProvider theme={Theme}>
            <Box
                sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "linear-gradient(10deg, #d3c125, #96948d)",
                }}
            >

                <Typography variant="body1" sx={{ fontSize: 40, fontStyle: "italic"}}>
                    18º Batalhão de Transporte
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems:"center",
                        height: "35vh",
                    }}
                >
                    <Image src='/image.png' alt="Logo" width={250}  height={300}/>  
                </Box>
                <Typography variant="body1" sx={{ fontSize: 40, fontStyle: "italic" }}>
                    A logística em movimento
                </Typography>
                <Box sx={{ width: "80%", mx: "auto"}}> {/* ajusta o tamanho das caixas que contém os relatórios com a tela*/}
                    {/* Accordion 1: Oficial de Dia */}
                    {(() => {
                        const postosOficialDia = ["1º Tenente", "2º Tenente", "Aspirante a Oficial"];
                        const count = militares.filter((m) => postosOficialDia.includes(m.posto)).length;
                        return (
                        <Accordion sx={{backgroundColor: "#6d6969c7"}}>
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

                    {/* Accordion 2: Adjunto ao Oficial de Dia */}
                    {(() => {
                        const postosAdjunto = ["1º Sgt Sargento", "2º Sgt Sargento"];
                        const count = militares.filter((m) => postosAdjunto.includes(m.posto)).length;
                        return (
                        <Accordion sx={{backgroundColor: "#6d6969c7"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: "bold" }}>
                                MILITARES QUE CONCORREM A ESCALA DE ADJUNTO AO OFICIAL DE DIA ({count})
                            </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            {renderTabelaPorPosto(postosAdjunto)}
                            </AccordionDetails>
                        </Accordion>
                        );
                    })()}

                    {/* Accordion 3: Sargento de Dia e Comandante da Guarda */}
                    {(() => {
                        const postosSargento = ["3º Sgt Sargento"];
                        const count = militares.filter((m) => postosSargento.includes(m.posto)).length;
                        return (
                        <Accordion sx={{backgroundColor: "#6d6969c7"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: "bold" }}>
                                MILITARES QUE CONCORREM A ESCALA DE SARGENTO DE DIA E COMANDANTE DA GUARDA ({count})
                            </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            {renderTabelaPorPosto(postosSargento)}
                            </AccordionDetails>
                        </Accordion>
                        );
                    })()}
                </Box>
                {/* Modal de Edição */}
                <Dialog open={!!editMilitar} onClose={() => setEditMilitar(null)}>
                    <DialogTitle>Editar Militar</DialogTitle>
                    <DialogContent>
                        <TextField
                        label="Nome"
                        fullWidth
                        margin="dense"
                        value={editMilitar?.nome || ""}
                        onChange={(e) =>
                            setEditMilitar({ ...editMilitar, nome: e.target.value })
                        }
                        />
                        <TextField
                        label="Posto"
                        fullWidth
                        margin="dense"
                        select
                        value={editMilitar?.posto || ""}
                        onChange={(e) =>
                            setEditMilitar({ ...editMilitar, posto: e.target.value })
                        }
                        >
                        {postos.map((p) => (
                            <MenuItem key={p} value={p}>{p}</MenuItem>
                        ))}
                        </TextField>
                        <TextField
                        label="Identidade"
                        fullWidth
                        margin="dense"
                        value={editMilitar?.identidade || ""}
                        onChange={(e) =>
                            setEditMilitar({ ...editMilitar, identidade: e.target.value })
                        }
                        />
                        <TextField
                        label="Data Praça"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={editMilitar?.dataPraca?.slice(0,10) || ""}
                        onChange={(e) =>
                            setEditMilitar({ ...editMilitar, dataPraca: e.target.value })
                        }
                        />
                        <TextField
                        label="Escala"
                        fullWidth
                        select
                        margin="dense"
                        value={editMilitar?.escala || ""}
                        onChange={(e) =>
                            setEditMilitar({ ...editMilitar, escala: e.target.value })
                        }
                        >
                        {escala.map((p) => (
                            <MenuItem key={p} value={p}>{p}</MenuItem>
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
                            setEditMilitar({ ...editMilitar, ultimo_servico: e.target.value })
                        }
                        />
                        <TextField
                        label="Status"
                        fullWidth
                        select
                        margin="dense"
                        value={editMilitar?.status || ""}
                        onChange={(e) =>
                            setEditMilitar({ ...editMilitar, status: e.target.value })
                        }
                        >
                        {status.map((p) => (
                            <MenuItem key={p} value={p}>{p}</MenuItem>
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
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handlesave}
                        >
                        Salvar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>    
    );
}



