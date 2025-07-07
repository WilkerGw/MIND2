"use client";

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import {
  Box, Button, Container, TextField, Typography, Paper, Snackbar, Alert
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/contexts/ProductsContext';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !price || !stock) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    await addProduct({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    });

    setOpenSnackbar(true);
    setTimeout(() => router.push('/products'), 2000);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Header title="Adicionar Novo Produto" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">Novo Produto</Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href="/products"
                >
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
                        <Button variant="contained" type="submit">Salvar Produto</Button>
                    </Box>
                </Box>
            </form>
        </Paper>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>Produto salvo com sucesso!</Alert>
      </Snackbar>
    </Box>
  );
}