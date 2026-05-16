"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import Image from "next/image";
import theme from "../../theme/layout";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

export default function PrimeiroAcesso() {
  const Theme = theme;
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senha || !confirmar) {
      alert("Preencha todos os campos");
      return;
    }
    if (senha !== confirmar) {
      alert("As senhas não coincidem");
      return;
    }
    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    try {
      await axios.post("/api/alterarSenha", {
        novaSenha: senha,
      });

      alert("Senha alterada com sucesso!");
      // se tudo ok permite acessar o sistema, indo para a página onde tem todos os militares cadastrados.
      router.push("/militares");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao alterar senha");
      } else {
        alert("Erro inesperado");
      }
    }
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
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10vh",
              backgroundColor: "#53534f",
              borderRadius: "0px 0px 100px 100px",
              border: "4px solid #0f0f01",
            }}
          >
            <Typography variant="body1" sx={{ fontSize: 60, fontStyle: "italic" }}>
              Escala Eletrônica
            </Typography>
          </Container>

          <Typography
            variant="body1"
            sx={{ fontSize: 35, fontStyle: "italic", marginTop: 2 }}
          >
            18º Batalhão de Transporte
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <Image src="/image.png" alt="Logo" width={225} height={270} />
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: 600 }}>
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
                textAlign:"center" 
              }}
            >
              <Typography variant="body1" sx={{ fontSize: 30, fontStyle: "italic" }}>
                Alterar senha de acesso
              </Typography>
              <TextField
                label="Nova Senha"
                type="password"
                fullWidth
                margin="normal"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <TextField
                label="Confirmar Senha"
                type="password"
                fullWidth
                margin="normal"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
            </Paper>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button 
                type="submit"
                variant="contained" 
                sx={{
                  width:200, 
                  border: '2px solid',
                  "&:hover": {
                      backgroundColor: "#a415c0", // efeito hover
                  },
                }} 
              >
                Alterar Senha
              </Button>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}