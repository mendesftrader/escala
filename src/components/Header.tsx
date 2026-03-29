"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar position="relative">
      <Toolbar>
        {/* Logo / Título */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ESCALA ELETRÔNICA
        </Typography>

        {/* Botões à direita */}
        <Box>
          <Button color="inherit" component={Link} href="/militares" >Militares Cadastrados</Button>
          <Button color="inherit" component={Link} href="/previsao">Previsão da Escala</Button>
          <Button color="inherit" component={Link} href="/inativo">Militares Inativos</Button>
          <Button color="inherit" component={Link} href="cadastro">Cadastro</Button>
          <Button color="inherit" component={Link} href=" ">Sair</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}