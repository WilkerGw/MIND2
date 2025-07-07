"use client";

import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const drawerWidth = 240; // Largura do nosso menu lateral

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Estado para controlar se o menu está aberto em ecrãs móveis
  const [mobileOpen, setMobileOpen] = useState(false);

  // Função que inverte o estado (de aberto para fechado e vice-versa)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Passamos a função de toggle para o Header */}
      <Header onDrawerToggle={handleDrawerToggle} />
      {/* Passamos o estado e a função para o Sidebar */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        {/* Este Toolbar cria um espaço para o conteúdo não ficar debaixo do Header */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}