"use client";

import { useLastPlayed } from "@/store/now-playing-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const setMainPlayerActive = useLastPlayed((s) => s.setMainPlayerActive);
  useEffect(() => {
    if (!pathname.startsWith("/watch")) {
      setMainPlayerActive(false);
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
