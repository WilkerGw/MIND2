"use client";

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 240;

interface HeaderProps {
    onDrawerToggle: () => void;
}

export function Header({ onDrawerToggle }: HeaderProps) {
    const { logout } = useAuth();

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="abrir menu"
                    edge="start"
                    onClick={onDrawerToggle} // O clique neste botão chama a função do AppLayout
                    sx={{ mr: 2, display: { sm: 'none' } }} // Só aparece em ecrãs pequenos
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    MIND ADM
                </Typography>
                <Tooltip title="Sair do Sistema">
                    <IconButton color="inherit" onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}