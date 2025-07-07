"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext'; // 1. Importar

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ClientInSale { id: string; name: string; }
export interface ProductInSaleItem { id: string; name: string; }
export interface SaleItem { id: string; quantity: number; price: number; product: ProductInSaleItem; }
export interface Sale { id: string; date: string; total: number; client: ClientInSale; items: SaleItem[]; }
interface NewSalePayload { clientId: string; items: { productId: string; quantity: number; }[]; }
interface SalesContextType { sales: Sale[]; addSale: (sale: NewSalePayload) => Promise<void>; loading: boolean; }

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // 2. Obter token

  useEffect(() => {
    if (token) { // 3. Verificar token
      const fetchSales = async () => {
        try {
          // 4. Enviar token
          const response = await fetch(`${API_URL}/sales`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Falha ao buscar vendas da API');
          const data = await response.json();
          setSales(data);
        } catch (error) {
          console.error('Erro ao buscar vendas:', error);
          setSales([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSales();
    } else {
        setLoading(false);
    }
  }, [token]);

  const addSale = async (saleData: NewSalePayload) => {
    try {
      const response = await fetch(`${API_URL}/sales`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(saleData) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registar a venda.');
      }
      // Re-fetch para ter os dados mais atualizados
      const salesResponse = await fetch(`${API_URL}/sales`, { headers: { 'Authorization': `Bearer ${token}` } });
      const updatedSales = await salesResponse.json();
      setSales(updatedSales);
    } catch (error) {
      console.error('Erro no addSale:', error);
      throw error;
    }
  };

  return (
    <SalesContext.Provider value={{ sales, addSale, loading }}>
      {children}
    </SalesContext.Provider>
  );
}
export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) throw new Error('useSales deve ser usado dentro de um SalesProvider');
  return context;
}