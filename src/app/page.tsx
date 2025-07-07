"use client";

// Não precisamos mais de importar o Header aqui
import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
import { useProducts } from "@/contexts/ProductsContext";
import { useClients } from "@/contexts/ClientsContext";
import { useSales } from "@/contexts/SalesContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RevenueByProductChart } from "@/components/dashboard/RevenueByProductChart";
import { LowStockProducts } from "@/components/dashboard/LowStockProducts";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { ClientOnly } from "@/components/common/ClientOnly";

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function DashboardPage() {
  const { products, loading: loadingProducts } = useProducts();
  const { clients, loading: loadingClients } = useClients();
  const { sales, loading: loadingSales } = useSales();

  const isLoading = loadingProducts || loadingClients || loadingSales;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalRevenue = sales.reduce((total, sale) => total + sale.total, 0);
  const totalClients = clients.length;
  const totalProducts = products.length;
  const totalSales = sales.length;
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    // A página agora só se preocupa com o seu próprio conteúdo
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Visão Geral do Negócio
      </Typography>
      
      <Grid container spacing={3}>
        {/* Linha dos StatCards */}
        <Grid item xs={12} sm={6} md={3}><StatCard title="Faturação Total" value={formatCurrency(totalRevenue)} icon={<MonetizationOnIcon />} color="success.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total de Clientes" value={totalClients} icon={<PeopleIcon />} color="info.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Produtos em Catálogo" value={totalProducts} icon={<InventoryIcon />} color="warning.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Vendas Realizadas" value={totalSales} icon={<ShoppingCartIcon />} color="error.main" /></Grid>

        <ClientOnly>
          {/* Linha dos Gráficos */}
          <Grid item xs={12} lg={8}><SalesChart sales={sales} /></Grid>
          <Grid item xs={12} lg={4}><RevenueByProductChart sales={sales} /></Grid>
          
          {/* Nova linha para as tabelas de informação */}
          <Grid item xs={12} lg={7}><RecentSales sales={sales} /></Grid>
          <Grid item xs={12} lg={5}><LowStockProducts products={products} /></Grid>
        </ClientOnly>
      </Grid>
    </Container>
  );
}