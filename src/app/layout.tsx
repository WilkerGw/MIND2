import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import { SalesProvider } from "@/contexts/SalesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedLayout from "@/components/layout/ProtectedLayout"; // 1. Importar o nosso novo guarda

export const metadata: Metadata = {
  title: "MIND ADM",
  description: "Sistema de gerenciamento unificado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <ProductsProvider>
              <ClientsProvider>
                <SalesProvider>
                  {/* 2. O ProtectedLayout agora envolve o conteúdo da aplicação */}
                  <ProtectedLayout>
                    {children}
                  </ProtectedLayout>
                </SalesProvider>
              </ClientsProvider>
            </ProductsProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}