"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext'; // 1. Importar

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Client { id: string; name: string; email: string; phone: string; }
export interface ClientUpdatePayload { name: string; email: string; phone: string; }
interface ClientsContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  updateClient: (id: string, updatedClient: ClientUpdatePayload) => Promise<void>;
  loading: boolean;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // 2. Obter token

  useEffect(() => {
    if (token) { // 3. Verificar token
      const fetchClients = async () => {
        try {
          // 4. Enviar token
          const response = await fetch(`${API_URL}/clients`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Falha ao buscar clientes da API');
          const data = await response.json();
          setClients(data);
        } catch (error) {
          console.error('Erro ao buscar clientes:', error);
          setClients([]);
        } finally {
          setLoading(false);
        }
      };
      fetchClients();
    } else {
        setLoading(false);
    }
  }, [token]);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/clients`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(clientData) });
      const newClient = await response.json();
      setClients((prev) => [...prev, newClient]);
    } catch (error) { console.error('Erro ao adicionar cliente:', error); }
  };
  const deleteClient = async (id: string) => {
    try {
      await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (error) { console.error('Erro ao excluir cliente:', error); }
  };
  const updateClient = async (id: string, updatedClientData: ClientUpdatePayload) => {
    try {
      const response = await fetch(`${API_URL}/clients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updatedClientData) });
      const updatedClient = await response.json();
      setClients((prev) => prev.map((c) => (c.id === id ? updatedClient : c)));
    } catch (error) { console.error('Erro ao atualizar cliente:', error); }
  };
  const getClientById = (id: string) => clients.find((client) => client.id === id);

  return (
    <ClientsContext.Provider value={{ clients, addClient, deleteClient, getClientById, updateClient, loading }}>
      {children}
    </ClientsContext.Provider>
  );
}
export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) throw new Error('useClients deve ser usado dentro de um ClientsProvider');
  return context;
}