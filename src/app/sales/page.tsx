"use client";

import { Header } from "@/components/layout/Header";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import { useSales } from "@/contexts/SalesContext";
import { SalesTable } from "@/components/sales/SalesTable";

export default function SalesPage() {
  const { sales } = useSales();

  return (
    <Box>
      <Header title="Gerenciar Vendas" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Histórico de Vendas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/sales/new"
          >
            Registrar Venda
          </Button>
        </Box>
        <SalesTable sales={sales} />
      </Container>
    </Box>
  );
}