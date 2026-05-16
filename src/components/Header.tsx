"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const handleLogout = async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login";
};

//função para estilizar o botão
const estiloBotao = {
  botao: {
    border:2, 
    margin:1,  
    "&:hover": {
      backgroundColor: "#f3f3ec4e", // efeito 
    },
  },
}

export default function Header() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetch("/api/userOnly")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);
////////////////////////////////////////role define novas rotas publicas ou não/////////////////////////////
  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" color="secondary" sx={{ flexGrow: 1 }}>
          ESCALA ELETRÔNICA
        </Typography>
        <Box>
          {/* TODOS podem ver */}
          <Button color="secondary" sx={estiloBotao.botao}  component={Link} href="/previsao">
            Previsão da Escala
          </Button>
          <Button color="secondary" sx={estiloBotao.botao}  component={Link} href="/consulta">
            Histórico Escala
          </Button>
           <Button color="secondary" sx={estiloBotao.botao}  component={Link} href="/inativo"> 
            Militares Inativos
          </Button>
        
          {/* SÓ ADMIN vê */}
          {user?.role === "admin" && (
            <>
              <Button color="secondary" sx={estiloBotao.botao}  component={Link} href="/militares">
                Militares Cadastrados
              </Button>

              <Button color="secondary" sx={estiloBotao.botao}  component={Link} href="/cadastro">
                Cadastro
              </Button>

              <Button color="secondary" sx={estiloBotao.botao}  component={Link} href="/gerarEscala">
                Consultar Escala
              </Button>
            </>
          )}
          <Button color="secondary" sx={estiloBotao.botao}  onClick={handleLogout}>
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}