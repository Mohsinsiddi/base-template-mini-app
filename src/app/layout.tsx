import type { Metadata } from "next";

import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";
import { MiniKitContextProvider } from "./miniKitProvider";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MiniKitContextProvider>
        <Providers>{children}</Providers>
        </MiniKitContextProvider>
      </body>
    </html>
  );
}
