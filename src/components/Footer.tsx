// ainda a fazer

"use client";

import { AppBar, Toolbar, Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <AppBar
            position="relative"
            sx={{
            top: "auto",
            bottom: 0,
            height: 130
            }}
        >
            <Toolbar sx={{ display:"flex", justifyContent: "center", alignItems:"center", height:"100%" }}>
            <Box>
                <Typography> Desenvolvido pela Seção de Informática do 18º Batalhão de Transporte </Typography>
            </Box>

            </Toolbar>
        </AppBar>
    );
}