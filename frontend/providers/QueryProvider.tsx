"use client";

// QueryProvider embolcalla l'aplicació amb el context de TanStack Query,
// que gestiona les crides asíncrones al backend (caching, loading, errors, mutations).
// Es declara com a "use client" perquè QueryClientProvider necessita context de React.
// Creem el QueryClient dins d'un useState per evitar recrear-lo a cada renderització.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
