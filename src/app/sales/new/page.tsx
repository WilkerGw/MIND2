"use client";

import React, { useState, useMemo } from 'react';
import { Header } from "@/components/layout/Header";
import {
  Box, Button, Container, Typography, Paper, Grid, TextField, Autocomplete, Table, TableBody, TableCell, TableHead, TableRow, Snackbar, Alert, TableContainer
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/navigation';

import { useClients } from '@/contexts/ClientsContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useSales } from '@/contexts/SalesContext';

// Interfaces locais para o formulário
interface ClientOption {
    id: string;
    name: string;
}
interface ProductOption {
    id: string;
    name: string;
    price: number;
}
interface SaleItemForm {
  product: ProductOption;
  quantity: number;
  subtotal: number;
}

export default function NewSalePage() {
  const router = useRouter();
  const { clients } = useClients();
  const { products } = useProducts();
  const { addSale } = useSales();

  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItemForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' } | null>(null);
  const [currentProduct, setCurrentProduct] = useState<ProductOption | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  const totalSale = useMemo(() => {
    return saleItems.reduce((total, item) => total + item.subtotal, 0);
  }, [saleItems]);

  const handleAddProduct = () => {
    if (!currentProduct || currentQuantity <= 0) {
      setSnackbar({ open: true, message: 'Selecione um produto e uma quantidade válida.', severity: 'error' });
      return;
    }
    if (saleItems.some(item => item.product.id === currentProduct.id)) {
      setSnackbar({ open: true, message: 'Este produto já foi adicionado à venda.', severity: 'error' });
      return;
    }
    
    setSaleItems(prevItems => [
      ...prevItems,
      {
        product: currentProduct,
        quantity: currentQuantity,
        subtotal: currentProduct.price * currentQuantity,
      }
    ]);
    setCurrentProduct(null);
    setCurrentQuantity(1);
  };

  const handleRegisterSale = async () => {
    if (!selectedClient) {
      setSnackbar({ open: true, message: 'Por favor, selecione um cliente.', severity: 'error' });
      return;
    }
    if (saleItems.length === 0) {
      setSnackbar({ open: true, message: 'Adicione pelo menos um produto à venda.', severity: 'error' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      clientId: selectedClient.id,
      items: saleItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      await addSale(payload);
      setSnackbar({ open: true, message: 'Venda registrada com sucesso!', severity: 'success' });
      setTimeout(() => router.push('/sales'), 2000);
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Ocorreu um erro.', severity: 'error' });
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Box>
      <Header title="Registrar Nova Venda" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">Nova Venda</Typography>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} component={Link} href="/sales">Voltar</Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                value={selectedClient}
                onChange={(event, newValue) => setSelectedClient(newValue)}
                renderInput={(params) => <TextField {...params} label="Selecione o Cliente" required />}
              />
            </Grid>

            <Grid xs={12}> <Typography variant="h6" sx={{ mt: 2 }}>Adicionar Produtos à Venda</Typography> </Grid>
            <Grid xs={6}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${formatCurrency(option.price)})`}
                value={currentProduct}
                onChange={(event, newValue) => setCurrentProduct(newValue)}
                renderInput={(params) => <TextField {...params} label="Selecione um Produto" />}
              />
            </Grid>
            <Grid xs={4}>
              <TextField
                label="Quantidade"
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" onClick={handleAddProduct} startIcon={<AddCircleOutlineIcon />} fullWidth>Adicionar</Button>
            </Grid>
            
            <Grid xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Itens da Venda</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell><TableCell>Qtd.</TableCell><TableCell>Preço Unit.</TableCell><TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleItems.map(item => (
                      <TableRow key={item.product.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.product.price)}</TableCell>
                        <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 4 }}>
                <Typography variant="h5" sx={{ mr: 4 }}>Total: {formatCurrency(totalSale)}</Typography>
                <Button 
                    variant="contained" 
                    color="success" 
                    size="large" 
                    onClick={handleRegisterSale}
                    disabled={isSubmitting}
                >
                  {isSubmitting ? 'A Registar...' : 'Finalizar e Registrar Venda'}
                </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      {snackbar && (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={() => setSnackbar(null)} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
      )}
    </Box>
  );
}