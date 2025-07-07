"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import {
  Box, Button, Container, TextField, Typography, Paper, Snackbar, Alert, CircularProgress
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useRouter } from 'next/navigation';
import { useClients } from '@/contexts/ClientsContext';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const { getClientById, updateClient } = useClients();

  // Estados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const clientId = params.id as string;

  // useEffect para carregar os dados do cliente
  useEffect(() => {
    if (clientId) {
      const client = getClientById(clientId);
      if (client) {
        setName(client.name);
        setEmail(client.email);
        setPhone(client.phone);
        setLoading(false);
      } else {
        setError('Cliente não encontrado.');
        setLoading(false);
      }
    }
  }, [clientId, getClientById]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateClient(clientId, { name, email, phone });
    setOpenSnackbar(true);
    setTimeout(() => router.push('/clients'), 2000);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Header title="Editar Cliente" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">Editar Cliente</Typography>
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
                <Button variant="contained" type="submit">Salvar Alterações</Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ width: '100%' }}>Cliente atualizado com sucesso!</Alert>
      </Snackbar>
    </Box>
  );
}