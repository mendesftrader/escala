// falta estilizar essa página

"use client";

import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NaoAutorizado() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        minHeight:"100vh",
        gap:2,
      }}
      
    >
      <Typography variant="h4" color="error">
        Acesso Negado
      </Typography>

      <Box sx={{position:"relative", width:"100%", maxWidth:400, height:{xs: 250, sm: 300, md: 350} }}>
        <Image src="/honey.PNG" fill alt="Honey"/>
      </Box>

      <Button
        variant="contained"
        onClick={() => router.push("/login")}
        sx={{ border:"2px solid", backgroundColor:"blueviolet", width:150}}
      >
        Voltar
      </Button>
    </Box>
  );
}