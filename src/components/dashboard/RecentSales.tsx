"use client";

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';
import { Sale } from '@/contexts/SalesContext';
import HistoryIcon from '@mui/icons-material/History';

interface RecentSalesProps {
  sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  // Ordenamos as vendas da mais recente para a mais antiga e pegamos as 5 primeiras
  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // --- A CORREÇÃO ESTÁ AQUI ---
  // A função agora converte a string da data num objeto Date antes de a formatar.
  const formatDate = (dateString: string) => new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HistoryIcon color="action" sx={{ mr: 1 }} />
        <Typography variant="h6">Vendas Recentes</Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  {/* Agora passamos a string da data para a nossa função corrigida */}
                  <TableCell>{formatDate(sale.date)}</TableCell>
                  <TableCell>{sale.client.name}</TableCell>
                  <TableCell align="right">{formatCurrency(sale.total)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhuma venda recente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}