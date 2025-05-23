import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const baseUrl = Constants.expoConfig?.extra?.trpcBaseUrl;
  
  if (baseUrl) {
    return baseUrl;
  }

  // Fallback for development
  if (__DEV__) {
    return "http://localhost:3000";
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_TRPC_BASE_URL environment variable"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

// Vanilla client for use outside React components
export const vanillaTrpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});