"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext'; // 1. Importar o hook de autenticação

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product { id: string; name: string; stock: number; price: number; }
export interface ProductUpdatePayload { name: string; stock: number; price: number; }
interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  updateProduct: (id: string, updatedProduct: ProductUpdatePayload) => Promise<void>;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // 2. Obter o token do AuthContext

  useEffect(() => {
    // 3. Só tentamos buscar os dados se o token existir
    if (token) {
      const fetchProducts = async () => {
        try {
          // 4. Adicionar o cabeçalho Authorization com o Bearer Token
          const response = await fetch(`${API_URL}/products`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Falha ao buscar produtos da API');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
        setLoading(false); // Se não houver token, paramos o loading
    }
  }, [token]); // Executa sempre que o token mudar

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(productData) });
      const newProduct = await response.json();
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) { console.error('Erro ao adicionar produto:', error); }
  };
  const deleteProduct = async (id: string) => {
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) { console.error('Erro ao excluir produto:', error); }
  };
  const updateProduct = async (id: string, updatedProductData: ProductUpdatePayload) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updatedProductData) });
      const updatedProduct = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
    } catch (error) { console.error('Erro ao atualizar produto:', error); }
  };
  const getProductById = (id: string) => products.find((product) => product.id === id);

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, getProductById, updateProduct, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}
export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  return context;
}