"use client";

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { Sale } from '@/contexts/SalesContext';

interface SalesChartProps {
  sales: Sale[];
}

export function SalesChart({ sales }: SalesChartProps) {
  // 1. Processar os dados para agregar as vendas por dia
  const processData = (salesData: Sale[]) => {
    if (!salesData || salesData.length === 0) {
      return [];
    }

    const salesByDay = salesData.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += sale.total;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(salesByDay).map(date => ({
      date,
      faturacao: salesByDay[date],
    })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
  };

  const chartData = processData(sales);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Faturação por Dia
      </Typography>
      {chartData.length > 0 ? (
        // 2. Usar o ResponsiveContainer para o gráfico se adaptar ao tamanho do contentor
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="faturacao" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography color="text.secondary">Não há dados de vendas suficientes para exibir o gráfico.</Typography>
        </Box>
      )}
    </Paper>
  );
}