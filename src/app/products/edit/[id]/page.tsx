"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import {
  Box, Button, Container, TextField, Typography, Paper, Snackbar, Alert, CircularProgress
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useRouter } from 'next/navigation';
import { useProducts, Product } from '@/contexts/ProductsContext';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); // Hook para obter os parâmetros da URL
  const { getProductById, updateProduct } = useProducts();

  // Estados do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const productId = params.id as string; // Obter o ID da URL

  // useEffect para carregar os dados do produto quando a página carregar
  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        // Pré-preenche o formulário com os dados do produto
        setName(product.name);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setLoading(false);
      } else {
        setError('Produto não encontrado.');
        setLoading(false);
      }
    }
  }, [productId, getProductById]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProduct(productId, {
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    });
    setOpenSnackbar(true);
    setTimeout(() => router.push('/products'), 2000);
  };
  
  // Se estiver a carregar, exibe um spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Se houver um erro (produto não encontrado)
  if (error) {
      return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Header title="Editar Produto" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          {/* ... (código do formulário é muito semelhante ao de "novo produto") */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1">Editar Produto</Typography>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} component={Link} href="/products">
                  Voltar para a Lista
              </Button>
          </Box>
          <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField label="Nome do Produto" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
                  <TextField label="Preço" type="number" fullWidth required value={price} onChange={(e) => setPrice(e.target.value)} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography> }}/>
                  <TextField label="Quantidade em Estoque" type="number" fullWidth required value={stock} onChange={(e) => setStock(e.target.value)} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                      <Button variant="outlined" color="secondary" component={Link} href="/products">Cancelar</Button>
                      <Button variant="contained" type="submit">Salvar Alterações</Button>
                  </Box>
              </Box>
          </form>
        </Paper>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ width: '100%' }}>Produto atualizado com sucesso!</Alert>
      </Snackbar>
    </Box>
  );
}