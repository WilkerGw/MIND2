"use client";

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';
import { Product } from '@/contexts/ProductsContext';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface LowStockProductsProps {
  products: Product[];
}

// Definimos o nosso limite para o que é considerado "baixo stock"
const STOCK_THRESHOLD = 10;

export function LowStockProducts({ products }: LowStockProductsProps) {
  // Filtramos a lista de produtos para encontrar apenas os que estão com baixo stock
  const lowStockItems = products
    .filter(product => product.stock <= STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock); // Ordenamos para mostrar os mais críticos primeiro

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
        <Typography variant="h6">Produtos com Baixo Stock</Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell align="right">Stock Restante</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {product.stock}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Nenhum produto com baixo stock.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}