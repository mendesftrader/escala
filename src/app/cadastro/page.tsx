"use client";

import { TextField, Button, Box, Typography, MenuItem, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from '../../theme/layout';
import axios from "axios";
import React, { useState, ChangeEvent } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Cadastro() {
  const Theme = theme;
  // muda o estado do formulário conforme digita os novos dados
  // o militar é cadastrado automaticamente como "ATIVO", o que já o inclui na escala
  const [form, setForm] = useState({
    nome: "",
    posto: "",
    identidade: "",
    dataPraca: "",
    escala: "",
    unidade: "",
  });

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

  // atualiza estado ao digitar
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //cria execeções para formatar o campo nome
  //formatar campos com a primeira letra maiscula e demais minusculas
  //nomes com palavras de duas sílabas apresentam erro ex: " Daniel Da Silva Campos", corrigir.
  const formataNomes = (text: string) => {
    const excecao = ["da", "de", "do", "das", "dos"]
    return text
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index !== 0 && excecao.includes(word)){
        return word;
      }
      return word.charAt(0).toUpperCase()+word.slice(1);
    })
    .join( " " );
  }
  // formata o campo nome
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "nome" && value.length > 0) {
      const formattedValue = formataNomes(value);
      setForm({
        ...form,
        [name]: formattedValue,
      });
    }
  };

  const formataIdentidade = (text: string) => {
    const apenasnumeros = text.replace(/\D/g, "");
    return apenasnumeros.slice(0, 10)
  }

  // formata o campo identidade
  const handleBlur2 = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "identidade" && value.length > 0) {
      const formattedValue = formataIdentidade(value);
      setForm({
        ...form,
        [name]: formattedValue,
      });
    }
  };

  // envia formulário para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação simples
    if (!form.nome || !form.posto || !form.identidade || !form.dataPraca || !form.escala || !form.unidade) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      // prepara os dados para envio ao back
      const payload = { ...form };
      // axios envia para o endpoint do Next.js API mais simples possivel
      const response = await axios.post("/api/militares", payload);
      alert(response.data.mensagem || "Usuário cadastrado com sucesso");
      // limpa formulário após clicar em cadastar
      setForm({ nome: "", posto: "", identidade: "", dataPraca: "", escala: "", unidade: "" });
      await fetch("/api/previsao");//necessário para atualizar a escala após alguma atualização
    } catch (error) {
      console.error("Erro ao salvar os dados", error);
      alert("Erro ao tentar cadastrar usuário.");
    }
  };
  return (
    <ThemeProvider theme={Theme}> 
      <Box
       sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            background: "linear-gradient(10deg, #d3c125, #96948d)",
            pt: 4
          }}
        >
          <Paper
            elevation={3}
            sx={{
              marginTop: 10,
              maxWidth: 500,
              width: "100%",
              p: 2,
              backgroundColor: "#fdf8f8e1",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              border: 2,
              "&:hover": {
                color: "#1041d6",
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
                onBlur={handleBlur}
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
                onBlur={handleBlur2}
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
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  sx={{
                    width:200, 
                    border: '2px solid',
                    "&:hover": {
                        backgroundColor: "#a415c0", // efeito 
                    },
                  }} 
                >
                  Cadastrar
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
