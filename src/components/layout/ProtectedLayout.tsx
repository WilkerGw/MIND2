"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "./AppLayout"; // O nosso layout principal com a Sidebar
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Se o carregamento inicial terminou e o utilizador NÃO está autenticado...
        // ...e não estamos já na página de login, redirecionamos para lá.
        if (!loading && !isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [loading, isAuthenticated, pathname, router]);

    // Enquanto o estado de autenticação está a ser verificado, mostramos um spinner
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // Se o utilizador não estiver autenticado E estiver a tentar aceder à página de login,
    // mostramos a página de login sem o layout principal.
    if (!isAuthenticated && pathname === '/login') {
        return <>{children}</>;
    }
    
    // Se o utilizador estiver autenticado, mostramos o layout principal com o conteúdo da página.
    if (isAuthenticated && pathname !== '/login') {
        return (
            <AppLayout>
                {children}
            </AppLayout>
        );
    }

    // Para todos os outros casos (como o redirecionamento a acontecer), não renderizamos nada.
    return null;
}