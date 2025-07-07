"use client";

import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { Sale } from '@/contexts/SalesContext';

interface RevenueByProductChartProps {
  sales: Sale[];
}

// Cores para as fatias do nosso gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

export function RevenueByProductChart({ sales }: RevenueByProductChartProps) {
  // 1. Processar os dados para agregar a faturação por produto
  const processData = (salesData: Sale[]) => {
    if (!salesData || salesData.length === 0) {
      return [];
    }

    const revenueByProduct = salesData.reduce((acc, sale) => {
      sale.items.forEach(item => {
        const productName = item.product.name;
        if (!acc[productName]) {
          acc[productName] = 0;
        }
        acc[productName] += item.subtotal;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(revenueByProduct).map(name => ({
      name,
      value: revenueByProduct[name],
    }));
  };

  const chartData = processData(sales);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Receita por Produto
      </Typography>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography color="text.secondary">Sem dados para exibir o gráfico de receita.</Typography>
        </Box>
      )}
    </Paper>
  );
}