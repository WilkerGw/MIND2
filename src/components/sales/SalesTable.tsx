"use client";

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Sale } from '@/contexts/SalesContext';

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString: string) => new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));

  const calculateTotalItems = (items: Sale['items']): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de vendas">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Total de Itens</TableCell>
            <TableCell align="right">Total (R$)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">Nenhuma venda registrada.</TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{formatDate(sale.date)}</TableCell>
                <TableCell>{sale.client.name}</TableCell>
                <TableCell>{calculateTotalItems(sale.items)}</TableCell>
                <TableCell align="right">{formatCurrency(sale.total)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}