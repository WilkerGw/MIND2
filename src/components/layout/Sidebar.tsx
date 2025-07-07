"use client";

import React from 'react';
import { Box, Drawer, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PackageIcon from '@mui/icons-material/Inventory2';
import Link from 'next/link';

const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Produtos', icon: <PackageIcon />, path: '/products' },
    { text: 'Clientes', icon: <PeopleIcon />, path: '/clients' },
    { text: 'Vendas', icon: <ShoppingCartIcon />, path: '/sales' },
];

interface SidebarProps {
    drawerWidth: number;
    mobileOpen: boolean;
    onDrawerToggle: () => void;
}

export function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }: SidebarProps) {
    
    const drawerContent = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} href={item.path} onClick={onDrawerToggle}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="menu principal"
        >
            {/* Menu para ecrãs pequenos (temporário) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Menu para ecrãs grandes (permanente) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}