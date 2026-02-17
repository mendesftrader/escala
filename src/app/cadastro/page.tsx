"use client"; // precisa porque vamos usar hooks do React (useState)

import {TextField, Button, Box, Typography, MenuItem, Paper } from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from '../../theme/theme'
import axios from "axios";
import React, { useState } from "react";

export default function Cadastro() {
  //função para usar o tema criado na pasta theme
  const Theme = theme;
  //função para editar o tamanho dos campos para cadastro de usuário textfield
  const estiloCampo = {
    display: "flex",
    flexdirection: "column",
  }

  //função para salvar os nomes digitados pelo usuário
  const[form, setFrom]=useState({
    nome: "",
    posto: "",
    identidade: "",
    senha: "",
    dataPraca: "",
    escala: "",
  })

  //função que exibe os tipos de escala no select
  const escalas=[
    "Oficial de Dia",
    "Adjunto ao Oficial de Dia",
    "Sargento de Dia",
    "Comandante da Guarda",
  ];

  //função para renderizar a página sempre que um campo for alterado
  const handleChange=(e)=>{
    setFrom({...form,[e.target.name]: e.target.value});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    //validação dos campos
    if(!form.nome || !form.posto || !form.identidade || !form.senha || !form.dataPraca || !form.escala) {
      alert("Preencha todos os campos!");
      return;
    };
    // Prepara os dados para enviar ao backend
    try{
      const payload={
        nome:form.nome,
        posto:form.posto,
        identidade:form.identidade,
        senha:form.senha,
        dataPraca:form.dataPraca,
        escala:form.escala,
      };
      // Axios envia o JSON automaticamente
      const response = await axios.post(
        "colocar rota do backend aqui",
        payload
      );

      // Resposta de sucesso
      alert(response.data.message);

      // Limpa o formulário
      setForm({ nome: "", posto: "", identidade: "", senha: "", dataPraca: "", escala: "" });
    }catch (err){
      if (err.response){
        // Erros retornados pelo backend
        alert(err.response.data.error || "Erro no cadastro");
      }else if (err.reques){
        // Requisição feita, mas sem resposta do servidor
        alert("Servidor não respondeu. Verifique se o backend está rodando.");
      } else {
        // Erro na configuração da requisição
        alert("Erro ao enviar a requisição: " + err.message);
      }
      console.error(err);
    }
  };



  return (
    <ThemeProvider theme={Theme}> {/*importa o tema criado na pasta theme*/}
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
        <Typography sx={{ fontSize: 40, fontStyle: "italic"}}>
        18º Batalhão de Transporte
        </Typography>
        <Box
          component="img"
          src="/image.png"
          alt="Logo"
          sx={{width: 200, padding: 1}}
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
            "&:hover": {               // efeito hover para melhor vizualização
                color: "#4cf709",
                textDecorationColor: "black",
                fontSize:"20px"
            },
          }}
        >
          <Typography variant="h5" align="center"sx={{mb:2}}>
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
             {/* Linha 1 */}
            <TextField
              label="Nome completo"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              size="small"
              variant="outlined" //necessário para mudar a borda
              sx={{
                width: 350,
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
              label="Posto/Graduação"
              name="posto"
              value={form.posto}
              onChange={handleChange}
              select
              required
              size="small"
              variant="outlined" //necessário para mudar a borda
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root":{
                  "&.Mui-focused fieldset":{
                    borderColor: "black", //cor da borda quando clicado
                  },
                },
                "& label.Mui-focused":{
                  color:"red", // label quando clicado
                },
              }}
            >
              <MenuItem value="Soldado">Soldado</MenuItem>
              <MenuItem value="Cabo">Cabo</MenuItem>
              <MenuItem value="3º Sgt Sargento">3º Sgt Sargento</MenuItem>
              <MenuItem value="2º Sgt Sargento">2º Sgt Sargento</MenuItem>
              <MenuItem value="1º Sgt Sargento">1º Sgt Sargento</MenuItem>
              <MenuItem value="Aspirante a Oficial">Aspirante a Oficial</MenuItem>
              <MenuItem value="2º Tenente">2º Tenente</MenuItem>
              <MenuItem value="1º Tenente">1º Tenente</MenuItem>
            </TextField>

            <TextField
              label="Identidade"
              name="identidade"
              value={form.identidade}
              onChange={handleChange}
              required
              size="small"
              variant="outlined" //necessário para mudar a borda
              sx={{
                width: 350,
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

            {/* Linha 2 */}
            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              required
              size="small"
              variant="outlined" //necessário para mudar a borda
              sx={{
                width: 350,
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
              label="Data de Praça"
              name="dataPraca"
              type="date"
              value={form.dataPraca}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
              variant="outlined" //necessário para mudar a borda
              sx={{
                width: 350,
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
              select
              label="Escala"
              name="escala"
              value={form.escala}
              onChange={handleChange}
              required
              size="small"
              variant="outlined" //necessário para mudar a borda
              sx={{
                width: 350,
                "& .MuiOutlinedInput-root":{
                  "&.Mui-focused fieldset":{
                    borderColor: "black", //cor da borda quando clicado
                  },
                },
                "& label.Mui-focused":{
                  color:"red", // label quando clicado
                },
              }}
            >
            {escalas.map((escala, index) => (
              <MenuItem key={index} value={escala}>
                {escala}
              </MenuItem>
            ))}
            </TextField>
            {/* Botão centralizado */}
            <Box sx={{gridColumn: "2 / 3", display:"flex", justifyContent:"center", mt: 1}}> {/*gridcolumn 2/3 faz o botão ficar no meio */}
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


