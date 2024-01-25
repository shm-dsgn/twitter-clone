import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    
    <GoogleOAuthProvider clientId="9345159235-0d1pe7shkh0036r14b2orcjstqo34c63.apps.googleusercontent.com">
      <Component {...pageProps} />
      <Toaster />
    </GoogleOAuthProvider>

  );
}
