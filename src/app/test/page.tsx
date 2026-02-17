"use client"; // precisa porque vamos usar hooks do React (useState)

import { Container, Typography, Button } from "@mui/material";
import {ThemeProvider, createTheme } from "@mui/material/styles";


export default function TestePage() {
  // Aqui você poderia usar o theme que você tem no MuiProvider, mas para teste rápido criamos um theme local
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Rota de Teste Material UI
        </Typography>
        <Typography variant="body1" gutterBottom>
          Esta é uma rota de teste dentro do App Router.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Botão de Teste
        </Button>
      </Container>
    </ThemeProvider>
  );
}


