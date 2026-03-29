"use client";

import { TextField, Button, Box, Typography, MenuItem, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from '../../theme/layout';
import axios from "axios";
import React, { useState, ChangeEvent } from "react";

export default function Cadastro() {
  const Theme = theme;

  // Muda o estado do formulário conforme digita os novos dados
  const [form, setForm] = useState({
    nome: "",
    posto: "",
    identidade: "",
    senha: "",
    dataPraca: "",
    escala: "",
    unidade: "",
  });

  // Tipos de escala
  const escalas = [
    "Oficial de Dia",
    "Adjunto ao Oficial de Dia",
    "Comandante da Guarda",
  ];

  const postos = [
    "3º Sargento",
    "2º Sargento",
    "1º Sargento",
    "Aspirante a Oficial",
    "2º Tenente",
    "1º Tenente",
  ];

  const unidades = [
    "18º BTrnp",
    "9º B Mnt",
    "Cia Cmd 9º Gpt Log",
    "9º B Sau",
  ]

  // Atualiza estado ao digitar
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Envia formulário para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação simples
    if (!form.nome || !form.posto || !form.identidade || !form.senha || !form.dataPraca || !form.escala || !form.unidade) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      // Prepara os dados para envio ao back
      const payload = { ...form };
      // Axios envia para o endpoint do Next.js API mais simples possivel
      const response = await axios.post("/api/militares", payload);
      alert(response.data.mensagem || "Usuário cadastrado com sucesso");
      // Limpa formulário após clicar em cadastar
      setForm({ nome: "", posto: "", identidade: "", senha: "", dataPraca: "", escala: "", unidade: "" });
    } catch (error) {
      console.error("Erro ao salvar os dados", error);
      alert("Erro ao tentar cadastrar usuário.");
    }
  };
  return (
    <ThemeProvider theme={Theme}> 
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(10deg, #d3c125, #96948d)",
        }}
      >
        <Typography sx={{ fontSize: 40, fontStyle: "italic" }}>
          18º Batalhão de Transporte
        </Typography>
        <Box
          component="img"
          src="/image.png"
          alt="Logo"
          sx={{ width: 200, padding: 1 }}
        />
        <Typography sx={{ fontSize: 40, fontStyle: "italic" }}>
          A logística em movimento
        </Typography>
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 2,
            backgroundColor: "#fdf8f8e1",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            border: 2,
            "&:hover": {
              color: "#4cf709",
              textDecorationColor: "black",
              fontSize: "20px"
            },
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Cadastro de Usuário
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5
            }}
          >
            <TextField
              label="Nome completo"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& label.Mui-focused": { color: "red" },
              }}
            />
            
            <TextField
              label="Posto/Graduação"
              name="posto"
              value={form.posto}
              onChange={handleChange}
              select
              required
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black" } },
                "& label.Mui-focused": { color: "red" },
              }}
            >
             {postos.map((postos, index) => (
                <MenuItem key={index} value={postos}>
                  {postos}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Identidade"
              name="identidade"
              value={form.identidade}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black" } },
                "& label.Mui-focused": { color: "red" },
              }}
            />

            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black" } },
                "& label.Mui-focused": { color: "red" },
              }}
            />

            <TextField
              label="Data de Praça"
              name="dataPraca"
              type="date"
              value={form.dataPraca}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black" } },
                "& label.Mui-focused": { color: "red" },
              }}
            />

            <TextField
              select
              label="Escala"
              name="escala"
              value={form.escala}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black" } },
                "& label.Mui-focused": { color: "red" },
              }}
            >
              {escalas.map((escala, index) => (
                <MenuItem key={index} value={escala}>
                  {escala}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Unidade"
              name="unidade"
              value={form.unidade}
              onChange={handleChange}
              select
              required
              size="small"
              variant="outlined"
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black" } },
                "& label.Mui-focused": { color: "red" },
              }}
            >
             {unidades.map((unidades, index) => (
                <MenuItem key={index} value={unidades}>
                  {unidades}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ px: 4 }}>
                Cadastrar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}