"use client";

import { Header } from "@/components/layout/Header";
import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import { ProductsTable } from "@/components/products/ProductsTable";
import { useProducts } from "@/contexts/ProductsContext";

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Header title="Gerenciar Produtos" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Lista de Produtos
          </Typography>
          
          {/* --- O PONTO CRÍTICO ESTÁ AQUI --- */}
          {/* Este botão deve ter o href="/products/new" */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/products/new"
          >
            Adicionar Produto
          </Button>
        </Box>

        <ProductsTable products={products} />

      </Container>
    </Box>
  );
}