// criando página de login simples

"use client"; //Por utilizar hooks

import { useState} from 'react';
import { TextField, Button, Box, Typography, Paper, Container } from "@mui/material";
import Image from 'next/image'; //importa a imagem da pasta public
import theme from '../../theme/layout' // permite usar as cores do theme em todas as páginas
import {ThemeProvider} from "@mui/material/styles"; //necessário envolver todo o código para utilização do theme
import axios from "axios";
import Footer from "../../components/Footer";


export default function Login ( ){
    const Theme = theme;
    const [identidade, setIdentidade] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identidade || !senha) {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const res = await axios.post("/api/login", {
                identidade,
                senha,
            });

            console.log("Login OK:", res.data);

            // logica para encaminhar o usuário ao primeiro login
            if (res.data.primeiro_login) {
                window.location.href = "/primeiro-acesso";
            } else {
                window.location.href = "/previsao";
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || "Erro ao fazer login");
            } else {
                alert("Erro inesperado");
            }
        }
    };

    return(
        <ThemeProvider theme={Theme}> 
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        flex:1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        height: "100vh",
                        background: "linear-gradient(10deg, #d3c125, #96948d)",
                    }}
                >
                   {/*container estilizado fingindo ser um head, somente para ficar mais agradável*/}
                    <Container sx={{
                            display:"flex", 
                            justifyContent: "center", 
                            alignItems: "center", 
                            height:"10vh", 
                            backgroundColor:"#585a5c",
                            borderRadius: "0px 0px 100px 100px",
                            border: "4px solid #0f0f01",
                        }}
                    >
                        <Typography variant="body1" sx={{ fontSize: 60, fontStyle: "italic"}}>
                            Escala Eletrônica
                        </Typography>
                    </Container>
                    <Typography variant="body1" sx={{ fontSize: 35, fontStyle: "italic", marginTop:2}}>
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
                        <Image src='/image.png' alt="Logo" width={225}  height={270}/>  
                    </Box>
                    <Typography variant="body1" sx={{ fontSize: 35, fontStyle: "italic" }}>
                        A logística em movimento
                    </Typography>
                    
                    <Box component="form" onSubmit={handleLogin} sx={{width: 600}}>
                        <Paper
                            elevation={3}
                            sx={{
                            backgroundColor: "#e0d7af",
                            maxWidth: 500,
                            width: "100%",
                            p: 2,
                            mx: "auto",
                            display: "flex",
                            flexDirection: "column",
                            border: 2,
                            "&:hover": { // efeito hover para melhor vizualização
                                color: "#165aeb",
                                textDecorationColor: "black",
                                fontSize:"20px"
                            },
                        }}
                        >
                            <TextField
                                label="Identidade"
                                type="text"
                                fullWidth
                                margin="normal"
                                value={identidade}
                                onChange={(e) => setIdentidade(e.target.value)}
                                variant="outlined" //necessário para mudar a borda
                                sx={{
                                    "& .MuiOutlinedInput-root":{
                                        "&.Mui-focused fieldset":{
                                        borderColor: "black", //cor da borda quando clicado
                                        },
                                    },
                                    "& label.Mui-focused":{
                                        color:"red", // label quando clicado
                                    },
                                }}
                            />
                            
                            <TextField
                                label="Senha"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                variant="outlined" //necessário para mudar a borda
                                sx={{
                                    "& .MuiOutlinedInput-root":{
                                        "&.Mui-focused fieldset":{
                                        borderColor: "black", //cor da borda quando clicado
                                        },
                                    },
                                    "& label.Mui-focused":{
                                        color:"red", // label quando clicado
                                    },
                                }}
                            />
                        </Paper>
                        <Box sx={{ mt: 2, display:"flex", justifyContent: "center", alignItems:"center"}}>
                            <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            sx={{
                                width:200, 
                                border: '2px solid',
                                "&:hover": {
                                    backgroundColor: "#a415c0", // efeito hover
                                },
                            }} 
                            >
                                Entrar
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>    
    );
}



