// pages/_app.tsx

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Session } from "next-auth";

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session | null }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}