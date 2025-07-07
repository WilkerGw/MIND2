"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import { useProducts } from '@/contexts/ProductsContext';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}
interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const { deleteProduct } = useProducts();
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleOpenDialog = (id: string) => {
    setSelectedProductId(id);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedProductId(null);
    setOpen(false);
  };
  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId);
    }
    handleCloseDialog();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <>
      {/* Adicionando overflow: 'auto' para o scroll horizontal */}
      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nome do Produto</TableCell>
              <TableCell align="right">Estoque</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Editar produto">
                      <IconButton aria-label="edit" color="primary" component={Link} href={`/products/edit/${product.id}`}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir produto">
                      <IconButton aria-label="delete" color="error" onClick={() => handleOpenDialog(product.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza de que deseja excluir o produto? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}