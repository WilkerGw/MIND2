"use client";

import React, { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

export function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Não renderiza nada no servidor ou na primeira renderização do cliente
  }

  return <>{children}</>;
}