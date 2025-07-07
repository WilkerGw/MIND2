"use client";

import React from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
      }}
    >
      <Box>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Box>
      <Avatar sx={{ backgroundColor: color, width: 56, height: 56 }}>
        {icon}
      </Avatar>
    </Paper>
  );
}