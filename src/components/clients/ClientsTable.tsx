"use client";

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import { useClients } from '@/contexts/ClientsContext';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const { deleteClient } = useClients();
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleOpenDialog = (id: string) => {
    setSelectedClientId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedClientId(null);
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
    }
    handleCloseDialog();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de clientes">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Editar cliente">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        component={Link}
                        href={`/clients/edit/${client.id}`}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir cliente">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleOpenDialog(client.id)}
                      >
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
        message={`Tem a certeza de que deseja excluir este cliente? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}