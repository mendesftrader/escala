"use client"; // precisa porque vamos usar hooks do React (useState)

import { Container, Typography, Button } from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from '../../theme/theme'


export default function TestePage() {
  //função para usar o tema criado na pasta theme
  const Theme = theme;

  return (
    <ThemeProvider theme={Theme}> {/*importa o tema criado na pasta theme*/}
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


