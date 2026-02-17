// criando página de login simples

"use client"; //Por utilizar hooks

import { useState} from 'react';
import { TextField, Button, Box, Typography, Link, Paper } from "@mui/material";
import Image from 'next/image'; //importa a imagem da pasta public
import theme from '../../theme/theme' // permite usar as cores do theme em todas as páginas
import {ThemeProvider} from "@mui/material/styles"; //necessário envolver todo o código para utilização do theme

export default function Login ( ){
    const Theme = theme;
    const [identidade, setIdentidade] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // logica de autenticação escolhida
        console.log("Identidade:", identidade);
        console.log("Senha:", password)
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
                        "&:hover": {               // efeito hover para melhor vizualização
                            color: "#d5eb16",
                            textDecorationColor: "black",
                            fontSize:"20px"
                        },
                    }}
                    >
                        <TextField
                            label="Idenitdade"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
        </ThemeProvider>    
    );
}



