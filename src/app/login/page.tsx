// criando página de login simples

"use client"; //Por utilizar hooks

import { useState} from 'react';
import { TextField, Button, Box, Typography, Link, Paper, Container } from "@mui/material";
import Image from 'next/image'; //importa a imagem da pasta public
import theme from '../../theme/layout' // permite usar as cores do theme em todas as páginas
import {ThemeProvider} from "@mui/material/styles"; //necessário envolver todo o código para utilização do theme
import axios from "axios";
import Footer from "../../components/Footer";


export default function Login ( ){
    const Theme = theme;
    const [identidade, setIdentidade] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        // validação simples
        if (!identidade || !senha) {
            alert("Preencha todos os campos");
            return;
        }
        try {
            await axios.post("/api/login", {
            identidade: identidade, // importante: nome igual ao backend
            senha: senha,
            });
            console.log("rota utilizada");
            console.log("dados recebidos:", identidade, senha);
            // redireciona para outra página que você escolher
            window.location.href = "/militares";
        }catch (error: unknown) {
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
                            backgroundColor:"#53534f",
                            borderRadius: "0px 0px 100px 100px",
                            border: "4px solid #0f0f01",
                        }}
                    >
                        <Typography variant="body1" sx={{ fontSize: 60, fontStyle: "italic"}}>
                            Escala Eletrônica
                        </Typography>
                    </Container>
                    <Typography variant="body1" sx={{ fontSize: 35, fontStyle: "italic", marginTop:5}}>
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
                            <Button type="submit" variant="contained" color="primary" sx={{ px: 10 }} >
                                Entrar
                            </Button>
                        </Box>
                        <Box>
                            <Link 
                                //incluir rota de cadastro e perca de senha
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "2vh",
                                    color: '#080808',
                                    cursor: "pointer",// cursor luvinha
                                    textDecoration:"none",
                                    padding: 1,
                                    fontFamily: "Roboto, sans-serif",
                                    "&:hover": {// efeito hover para melhor vizualização
                                        color: "#f70909",
                                        textDecorationColor: "black",
                                        fontSize:"20px"
                                    },
                                }}
                            >
                                Faça o seu cadastro
                            </Link>
                        </Box>
                        <Box>
                            <Link 
                                //incluir rota de cadastro e perca de senha
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "2vh",
                                    color: '#080808',
                                    cursor: "pointer",// cursor luvinha
                                    textDecoration:"none",
                                    fontFamily: "Roboto, sans-serif",
                                    "&:hover": {// efeito hover para melhor vizualização
                                        color: "#f70909",
                                        textDecorationColor: "black",
                                        fontSize:"20px"
                                    },
                                }}
                            >
                                Esqueceu a senha?
                            </Link>
                        </Box>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>    
    );
}



