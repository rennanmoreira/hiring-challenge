"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import MainLayout from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>{children}</MainLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}
