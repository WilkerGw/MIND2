"use client";

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import {
  Box, Button, Container, TextField, Typography, Paper, Snackbar, Alert
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useClients } from '@/contexts/ClientsContext';

export default function NewClientPage() {
  const router = useRouter();
  const { addClient } = useClients(); // Obtém a função do contexto

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !phone) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    addClient({ name, email, phone });
    setOpenSnackbar(true);
    setTimeout(() => router.push('/clients'), 2000);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Header title="Adicionar Novo Cliente" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">Novo Cliente</Typography>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} component={Link} href="/clients">
              Voltar para a Lista
            </Button>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField label="Nome Completo" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
              <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Telefone" fullWidth required value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" color="secondary" component={Link} href="/clients">Cancelar</Button>
                <Button variant="contained" type="submit">Salvar Cliente</Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Cliente salvo com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}