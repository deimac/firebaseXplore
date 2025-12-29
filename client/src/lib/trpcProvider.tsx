import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";
import { auth } from "../firebase"; // Import our Firebase auth instance

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          // This function is called before every request, and its result is used as the HTTP headers.
          async headers() {
            const user = auth.currentUser;
            // If the user is not logged in, we won't have a token.
            if (!user) {
              return {};
            }
            // Get the user's ID token.
            const token = await user.getIdToken();
            // Return the headers with the Authorization token.
            return {
              Authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
