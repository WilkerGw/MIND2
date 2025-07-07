"use client";

import { Header } from "@/components/layout/Header";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import { useClients } from "@/contexts/ClientsContext";
import { ClientsTable } from "@/components/clients/ClientsTable";

export default function ClientsPage() {
  const { clients } = useClients(); // Lê os clientes do nosso novo contexto

  return (
    <Box>
      <Header title="Gerenciar Clientes" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Lista de Clientes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/clients/new"
          >
            Adicionar Cliente
          </Button>
        </Box>
        <ClientsTable clients={clients} />
      </Container>
    </Box>
  );
}